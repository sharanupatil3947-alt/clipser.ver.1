from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON, Boolean, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Clip(Base):
    __tablename__ = "clips"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"))
    title = Column(String, nullable=False) # e.g. "THE COMPOUNDING CAREER SECRET"
    hook_sentence = Column(String, nullable=False)
    virality_score = Column(Integer, default=90) # 0 to 100
    virality_explanation = Column(Text, default="")
    
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    duration = Column(Float, default=30.0)
    
    aspect_ratio = Column(String, default="9:16") # "9:16", "1:1", "16:9"
    video_url = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    caption_style = Column(String, default="karaoke_cyan_glow")
    
    active_speaker_x = Column(Float, default=0.5) # Normalized 0.0 - 1.0 focus center
    subtitles_json = Column(JSON, nullable=True) # Word-by-word timestamps
    
    is_favorite = Column(Boolean, default=False)
    is_scheduled = Column(Boolean, default=False)
    
    project = relationship("Project", back_populates="clips")
    scheduled_posts = relationship("ScheduledPost", back_populates="clip", cascade="all, delete-orphan")
    
    created_at = Column(DateTime, server_default=func.now())
