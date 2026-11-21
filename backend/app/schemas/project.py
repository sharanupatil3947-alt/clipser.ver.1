from pydantic import BaseModel
from typing import Optional, List, Any

class ProjectCreate(BaseModel):
    url: Optional[str] = None
    title: Optional[str] = None
    source_type: Optional[str] = "youtube"

class ClipResponse(BaseModel):
    id: str
    project_id: str
    title: str
    hook_sentence: str
    virality_score: int
    virality_explanation: Optional[str] = ""
    start_time: float
    end_time: float
    duration: float
    aspect_ratio: Optional[str] = "9:16"
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    caption_style: Optional[str] = "karaoke_cyan_glow"
    active_speaker_x: Optional[float] = 0.5
    subtitles_json: Optional[Any] = None
    is_favorite: Optional[bool] = False
    is_scheduled: Optional[bool] = False

    class Config:
        from_attributes = True

class ProjectResponse(BaseModel):
    id: str
    title: str
    source_url: Optional[str] = None
    source_type: Optional[str] = "youtube"
    thumbnail_url: Optional[str] = None
    duration_seconds: Optional[float] = 0.0
    duration_formatted: Optional[str] = "00:00"
    status: Optional[str] = "processing"
    progress: Optional[int] = 0
    current_step: Optional[str] = ""
    clips: List[ClipResponse] = []
    created_at: Optional[Any] = None

    class Config:
        from_attributes = True
