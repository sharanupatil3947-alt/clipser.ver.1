from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SchedulePostCreate(BaseModel):
    clip_id: str
    platform: Optional[str] = "tiktok"
    platforms: Optional[List[str]] = None
    scheduled_time: Optional[datetime] = None
    caption: Optional[str] = ""
    hashtags: Optional[str] = ""

class ScheduledPostResponse(BaseModel):
    id: int
    clip_id: str
    platform: str
    scheduled_time: datetime
    caption: str
    hashtags: str
    status: str
    published_post_url: Optional[str] = None
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    clip_title: Optional[str] = None
    clip_thumbnail: Optional[str] = None
    virality_score: Optional[int] = None
    duration: Optional[float] = None
    video_url: Optional[str] = None

class SocialAccountUpdate(BaseModel):
    account_name: Optional[str] = None
    status: Optional[str] = None
