from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.crm import CRMIntegration
from app.schemas.crm import CRMCreate, CRMSyncTrigger
from app.services.crm_service import crm_service

router = APIRouter(prefix="/crm", tags=["CRM Integrations"])

@router.get("/integrations")
def list_integrations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    integrations = db.query(CRMIntegration).filter(CRMIntegration.user_id == current_user.id).all()
    if not integrations:
        # Prepopulate standard enterprise CRM connectors
        defaults = [
            CRMIntegration(user_id=current_user.id, crm_type="hubspot", name="HubSpot Marketing Hub", is_active=True, sync_status="connected"),
            CRMIntegration(user_id=current_user.id, crm_type="salesforce", name="Salesforce Media Cloud", is_active=True, sync_status="connected"),
            CRMIntegration(user_id=current_user.id, crm_type="zoho", name="Zoho CRM Enterprise", is_active=False, sync_status="ready_to_connect"),
            CRMIntegration(user_id=current_user.id, crm_type="webhook", name="Custom Realtime Webhook", endpoint_url="https://api.yourdomain.com/webhooks/clipser", is_active=True, sync_status="active")
        ]
        db.add_all(defaults)
        db.commit()
        integrations = defaults
    return integrations

@router.post("/integrations")
def add_integration(data: CRMCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = CRMIntegration(
        user_id=current_user.id,
        crm_type=data.crm_type,
        name=data.name,
        endpoint_url=data.endpoint_url,
        sync_contacts=data.sync_contacts,
        sync_video_events=data.sync_video_events,
        is_active=True,
        sync_status="connected"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.post("/sync")
def trigger_sync(req: CRMSyncTrigger, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    integration = db.query(CRMIntegration).filter(CRMIntegration.id == req.integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
        
    result = crm_service.sync_integration(integration.crm_type, integration.id, {})
    return result
