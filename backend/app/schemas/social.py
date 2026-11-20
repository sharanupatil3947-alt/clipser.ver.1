from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SchedulePostCreate(BaseModel):
    clip_id: str
    platform: str
    scheduled_time: datetime
    caption: Optional[str] = ""
    hashtags: Optional[str] = ""
