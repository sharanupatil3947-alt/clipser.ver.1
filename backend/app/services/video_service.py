import os
import uuid
import asyncio
import logging
import subprocess
import tempfile
from typing import Optional, Dict, Any
from pathlib import Path
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.project import Project
from app.models.clip import Clip
from app.services.transcription import transcription_service
from app.services.face_tracker import face_tracker
from app.services.virality_scorer import virality_scorer
from app.services.clip_renderer import clip_renderer

logger = logging.getLogger(__name__)


def _download_youtube(url: str, output_dir: str) -> Optional[str]:
    """Download YouTube video using yt-dlp (if available)."""
    try:
        output_template = os.path.join(output_dir, "%(id)s.%(ext)s")
        result = subprocess.run(
            ["yt-dlp", "-f", "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
             "--merge-output-format", "mp4",
             "-o", output_template, url],
            capture_output=True, text=True, timeout=600
        )
        if result.returncode == 0:
            for f in os.listdir(output_dir):
                if f.endswith(".mp4"):
                    return os.path.join(output_dir, f)
        logger.error(f"yt-dlp error: {result.stderr[:300]}")
    except FileNotFoundError:
        logger.warning("yt-dlp not installed. Cannot download YouTube videos.")
    except Exception as e:
        logger.error(f"Download failed: {e}")
    return None


def _get_video_duration(path: str) -> float:
    """Get video duration in seconds using ffprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", path],
            capture_output=True, text=True, timeout=30
        )
        return float(result.stdout.strip())
    except Exception:
        return 0.0


def _format_duration(seconds: float) -> str:
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


class VideoService:
    def __init__(self):
        self.active_tasks = {}

    async def process_project_pipeline(self, project_id: str, db: Session, websocket_manager=None):
        """Full AI processing pipeline: download -> transcribe -> track -> score -> render clips."""
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return

        async def update_status(step: str, progress: int, status: str = "processing"):
            project.current_step = step
            project.progress = progress
            project.status = status
            db.commit()
            if websocket_manager:
                await websocket_manager.broadcast_to_project(project_id, {
                    "type": "progress_update",
                    "project_id": project_id,
                    "step": step,
                    "progress": progress,
                    "status": status
                })
            await asyncio.sleep(0.3)

        try:
            # Step 1: Download / Locate source video
            await update_status("Downloading source video...", 5)
            video_path = project.local_video_path

            if not video_path or not os.path.isfile(video_path):
                if project.source_url and ("youtube.com" in project.source_url or "youtu.be" in project.source_url):
                    upload_dir = os.path.join(settings.UPLOADS_DIR, project_id)
                    os.makedirs(upload_dir, exist_ok=True)
                    video_path = _download_youtube(project.source_url, upload_dir)
                    if video_path:
                        project.local_video_path = video_path
                        db.commit()

            if not video_path or not os.path.isfile(video_path):
                await update_status("Error: Video file not found. Upload a file or provide a valid YouTube URL.", 0, "failed")
                return

            # Get duration
            duration = _get_video_duration(video_path)
            if duration > 0:
                project.duration_seconds = duration
                project.duration_formatted = _format_duration(duration)
                db.commit()

            await update_status("Source video ready.", 10)

            # Step 2: Transcription
            await update_status("Transcribing speech with word-level accuracy...", 20)
            transcript_data = await asyncio.to_thread(
                transcription_service.transcribe, video_path, project.title
            )
            project.transcript_json = transcript_data
            db.commit()
            await update_status("Transcription complete.", 40)

            if not transcript_data.get("segments"):
                await update_status("Warning: No speech detected in video.", 40)

            # Step 3: Face Tracking
            await update_status("Tracking faces for smart crop...", 50)
            face_data = await asyncio.to_thread(
                face_tracker.detect_active_speaker_trajectory, video_path, 0, duration
            )
            await update_status("Face tracking complete.", 60)

            # Step 4: Virality Scoring & Hook Generation
            await update_status("Scoring clips for virality potential...", 65)
            generated_clips = virality_scorer.analyze_and_rank_clips(project.title, transcript_data)
            await update_status(f"Found {len(generated_clips)} viral clip candidates.", 75)

            if not generated_clips:
                await update_status("No clip candidates found. Try a longer video with more speech.", 75, "ready")
                return

            # Step 5: Render clips with smart crop + captions
            await update_status("Rendering clips with smart crop and captions...", 80)
            clips_dir = os.path.join(settings.CLIPS_DIR, project_id)
            thumbs_dir = os.path.join(settings.THUMBNAILS_DIR, project_id)
            os.makedirs(clips_dir, exist_ok=True)
            os.makedirs(thumbs_dir, exist_ok=True)

            focus_x = face_data.get("focus_x", 0.5)

            for idx, c in enumerate(generated_clips):
                clip_id = f"clip_{uuid.uuid4().hex[:10]}"
                clip_path = os.path.join(clips_dir, f"{clip_id}.mp4")
                thumb_path = os.path.join(thumbs_dir, f"{clip_id}.jpg")

                # Find words for this clip's time range
                clip_words = []
                for seg in transcript_data.get("segments", []):
                    if seg["start"] >= c["start_time"] and seg["end"] <= c["end_time"]:
                        clip_words.extend(seg.get("words", []))

                # Render the clip
                await asyncio.to_thread(
                    clip_renderer.render_clip,
                    input_video=video_path,
                    output_path=clip_path,
                    start_time=c["start_time"],
                    end_time=c["end_time"],
                    focus_x=focus_x,
                    aspect_ratio="9:16",
                    caption_style="karaoke_cyan_glow",
                    words=clip_words if clip_words else None,
                    hook_text=c.get("hook_sentence", ""),
                )

                # Generate thumbnail
                await asyncio.to_thread(
                    clip_renderer.generate_thumbnail,
                    video_path, thumb_path,
                    timestamp=c["start_time"] + 1.0,
                    text=c.get("hook_sentence", "")
                )

                # Save to DB
                db_clip = Clip(
                    id=clip_id,
                    project_id=project.id,
                    title=c["title"],
                    hook_sentence=c.get("hook_sentence", c["title"]),
                    virality_score=c["virality_score"],
                    virality_explanation=c.get("virality_explanation", ""),
                    start_time=c["start_time"],
                    end_time=c["end_time"],
                    duration=c.get("duration", c["end_time"] - c["start_time"]),
                    aspect_ratio="9:16",
                    video_url=f"/storage/clips/{project_id}/{clip_id}.mp4",
                    thumbnail_url=f"/storage/thumbnails/{project_id}/{clip_id}.jpg",
                    caption_style="karaoke_cyan_glow",
                    active_speaker_x=focus_x,
                    subtitles_json=clip_words if clip_words else None,
                    is_favorite=False,
                    is_scheduled=False,
                )
                db.add(db_clip)

                progress = 80 + int(15 * (idx + 1) / len(generated_clips))
                await update_status(f"Rendered clip {idx + 1}/{len(generated_clips)}...", progress)

            db.commit()

            # Step 6: Done
            clip_count = len(generated_clips)
            top_score = max(c["virality_score"] for c in generated_clips) if generated_clips else 0
            await update_status(
                f"{clip_count} clips generated with top score {top_score}",
                100, "ready"
            )
            logger.info(f"Project {project_id}: {clip_count} clips rendered successfully.")

        except Exception as e:
            logger.error(f"Pipeline error for {project_id}: {e}", exc_info=True)
            await update_status(f"Error: {str(e)[:200]}", 0, "failed")


video_service = VideoService()
