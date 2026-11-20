from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class SocialAccount(Base):
    __tablename__ = "social_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform = Column(String, nullable=False) # "youtube", "tiktok", "instagram", "twitter", "linkedin"
    account_name = Column(String, nullable=False)
    access_token = Column(String, nullable=True)
    refresh_token = Column(String, nullable=True)
    avatar_url = Column(String, default="")
    status = Column(String, default="connected")
    connected_at = Column(DateTime, server_default=func.now())
    
    user = relationship("User", back_populates="social_accounts")

class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    clip_id = Column(String, ForeignKey("clips.id"))
    platform = Column(String, nullable=False) # "tiktok", "instagram", "youtube_shorts"
    scheduled_time = Column(DateTime, nullable=False)
    caption = Column(String, default="")
    hashtags = Column(String, default="#viral #clips #shorts #ai")
    status = Column(String, default="scheduled") # "scheduled", "publishing", "published", "failed"
    published_post_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    clip = relationship("Clip", back_populates="scheduled_posts")
