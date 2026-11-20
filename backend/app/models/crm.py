from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class CRMIntegration(Base):
    __tablename__ = "crm_integrations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    crm_type = Column(String, nullable=False) # "hubspot", "salesforce", "zoho", "webhook"
    name = Column(String, default="CRM Integration")
    api_key_masked = Column(String, default="sk_live_••••••••")
    endpoint_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    sync_contacts = Column(Boolean, default=True)
    sync_video_events = Column(Boolean, default=True)
    sync_status = Column(String, default="operational")
    last_sync_at = Column(DateTime, nullable=True)
    config_json = Column(JSON, default=dict)
    
    created_at = Column(DateTime, server_default=func.now())
    user = relationship("User", back_populates="crm_integrations")
