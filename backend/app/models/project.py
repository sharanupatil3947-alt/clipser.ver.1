from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True) # Unique slug or UUID
    title = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    source_type = Column(String, default="youtube") # "youtube", "upload", "twitch", "loom"
    local_video_path = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    duration_seconds = Column(Float, default=0.0)
    duration_formatted = Column(String, default="00:00")
    status = Column(String, default="processing") # "downloading", "transcribing", "reframing", "scoring", "ready", "failed"
    progress = Column(Integer, default=0) # 0 - 100%
    current_step = Column(String, default="Initializing")
    transcript_json = Column(JSON, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="projects")
    clips = relationship("Clip", back_populates="project", cascade="all, delete-orphan")
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
