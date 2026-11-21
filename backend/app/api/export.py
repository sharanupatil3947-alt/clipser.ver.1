import os
import subprocess
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.clip import Clip

router = APIRouter(prefix="/export", tags=["Export"])

RESOLUTIONS = {
    "1080p": (1080, 1920),
    "720p": (720, 1280),
    "480p": (480, 854),
}


@router.get("/{clip_id}")
def export_clip(
    clip_id: str,
    resolution: Literal["1080p", "720p", "480p"] = Query("1080p"),
    format: Literal["mp4", "mov"] = Query("mp4"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    clip = db.query(Clip).filter(Clip.id == clip_id).first()
    if not clip:
        raise HTTPException(404, "Clip not found")

    # Resolve the original clip file
    original = clip.video_url
    if original and original.startswith("/storage/"):
        original = os.path.join(settings.STORAGE_DIR, original.replace("/storage/", "", 1))

    if not original or not os.path.isfile(original):
        raise HTTPException(404, "Clip file not found on disk")

    # If 1080p mp4, serve directly
    if resolution == "1080p" and format == "mp4":
        return FileResponse(original, media_type="video/mp4", filename=f"{clip_id}.mp4")

    # Otherwise re-encode to target resolution/format
    w, h = RESOLUTIONS.get(resolution, (1080, 1920))
    export_dir = os.path.join(settings.STORAGE_DIR, "exports")
    os.makedirs(export_dir, exist_ok=True)
    out_path = os.path.join(export_dir, f"{clip_id}_{resolution}.{format}")

    if not os.path.exists(out_path):
        cmd = [
            "ffmpeg", "-y", "-i", original,
            "-vf", f"scale={w}:{h}",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-c:a", "aac",
            out_path
        ]
        try:
            subprocess.run(cmd, capture_output=True, timeout=120)
        except Exception as e:
            raise HTTPException(500, f"Export failed: {e}")

    media = "video/mp4" if format == "mp4" else "video/quicktime"
    return FileResponse(out_path, media_type=media, filename=f"{clip_id}_{resolution}.{format}")
