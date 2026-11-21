from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, default="")
    avatar_url = Column(String, default="")
    hashed_password = Column(String, nullable=True)
    auth_provider = Column(String, default="email") # "email", "google"
    google_id = Column(String, nullable=True, unique=True)
    is_pro = Column(Boolean, default=True) # All Clipser users enjoy free Pro privileges
    plan_tier = Column(String, default="pro_unlimited")
    source_minutes_remaining = Column(Integer, default=999999) # No limits
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    social_accounts = relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
    scheduled_posts = relationship("ScheduledPost", back_populates="user", cascade="all, delete-orphan")
