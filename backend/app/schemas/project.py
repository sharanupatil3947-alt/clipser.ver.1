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
    virality_explanation: str
    start_time: float
    end_time: float
    duration: float
    aspect_ratio: str
    video_url: Optional[str]
    thumbnail_url: Optional[str]
    caption_style: str
    active_speaker_x: float
    subtitles_json: Optional[Any]
    is_favorite: bool
    is_scheduled: bool

class ProjectResponse(BaseModel):
    id: str
    title: str
    source_url: Optional[str]
    source_type: str
    thumbnail_url: Optional[str]
    duration_seconds: float
    duration_formatted: str
    status: str
    progress: int
    current_step: str
    clips: List[ClipResponse] = []
    created_at: Any
