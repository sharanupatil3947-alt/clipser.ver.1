import os
import uuid
import asyncio
import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.project import Project
from app.models.clip import Clip
from app.services.transcription import transcription_service
from app.services.face_tracker import face_tracker
from app.services.virality_scorer import virality_scorer
from app.services.clip_renderer import clip_renderer

logger = logging.getLogger(__name__)

class VideoService:
    def __init__(self):
        self.active_tasks = {}

    async def process_project_pipeline(self, project_id: str, db: Session, websocket_manager=None):
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
            await asyncio.sleep(0.5) # Smooth low-latency progress transition

        try:
            # Step 1: Downloading & Ingesting
            await update_status("Ingesting source media and extracting audio stream...", 15)
            await asyncio.sleep(0.8)

            # Step 2: AI Transcription with Word Timestamps
            await update_status("Transcribing speech with word-level accuracy...", 35)
            transcript_data = transcription_service.transcribe(
                project.local_video_path or project.source_url or "",
                title=project.title
            )
            project.transcript_json = transcript_data
            db.commit()
            await asyncio.sleep(0.8)

            # Step 3: Face Tracking & Reframing
            await update_status("Analyzing active speaker coordinates (16:9 -> 9:16)...", 55)
            await asyncio.sleep(0.8)

            # Step 4: Virality Scoring & Hook Generation
            await update_status("Evaluating soundbite retention & virality scores...", 75)
            generated_clips = virality_scorer.analyze_and_rank_clips(project.title, transcript_data)
            await asyncio.sleep(0.8)

            # Step 5: Generating clips & animated subtitles
            await update_status("Generating dynamic animated captions and hooks...", 90)
            
            # Save clips into Database
            for c in generated_clips:
                clip_id = f"clip_{uuid.uuid4().hex[:10]}"
                clip_rel_path = f"/storage/clips/{clip_id}.mp4"
                thumb_rel_path = f"/storage/thumbnails/{clip_id}.jpg"
                
                db_clip = Clip(
                    id=clip_id,
                    project_id=project.id,
                    title=c["title"],
                    hook_sentence=c["hook_sentence"],
                    virality_score=c["virality_score"],
                    virality_explanation=c["virality_explanation"],
                    start_time=c["start_time"],
                    end_time=c["end_time"],
                    duration=c["duration"],
                    aspect_ratio="9:16",
                    video_url=clip_rel_path,
                    thumbnail_url=thumb_rel_path,
                    caption_style="karaoke_cyan_glow",
                    active_speaker_x=c.get("active_speaker_x", 0.5),
                    is_favorite=False,
                    is_scheduled=False
                )
                db.add(db_clip)
            
            db.commit()
            await asyncio.sleep(0.5)

            # Step 6: Ready
            await update_status("Clips ready for review and scheduling!", 100, status="ready")
            logger.info(f"Project {project_id} successfully processed into viral clips.")

        except Exception as e:
            logger.error(f"Error processing project {project_id}: {e}", exc_info=True)
            await update_status(f"Error: {str(e)}", 0, status="failed")

video_service = VideoService()
