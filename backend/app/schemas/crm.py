from pydantic import BaseModel
from typing import Optional, Dict, Any

class CRMCreate(BaseModel):
    crm_type: str
    name: Optional[str] = "My CRM"
    api_key: Optional[str] = ""
    endpoint_url: Optional[str] = ""
    sync_contacts: bool = True
    sync_video_events: bool = True
    config: Optional[Dict[str, Any]] = {}

class CRMSyncTrigger(BaseModel):
    integration_id: int
    event_type: str = "manual_sync"
