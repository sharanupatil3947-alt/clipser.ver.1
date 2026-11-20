from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.social import ScheduledPost, SocialAccount
from app.models.clip import Clip
from app.schemas.social import SchedulePostCreate
from app.services.social_scheduler import social_scheduler

router = APIRouter(prefix="/schedule", tags=["Social Scheduler"])

@router.get("/accounts")
def get_social_accounts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    accounts = db.query(SocialAccount).filter(SocialAccount.user_id == current_user.id).all()
    if not accounts:
        # Default mock connected accounts for Pro creator experience
        default_accounts = [
            SocialAccount(user_id=current_user.id, platform="tiktok", account_name="@clipser_official", status="connected"),
            SocialAccount(user_id=current_user.id, platform="instagram", account_name="clipser_reels", status="connected"),
            SocialAccount(user_id=current_user.id, platform="youtube", account_name="Clipser Shorts", status="connected"),
            SocialAccount(user_id=current_user.id, platform="linkedin", account_name="Clipser AI", status="connected")
        ]
        db.add_all(default_accounts)
        db.commit()
        accounts = default_accounts
    return accounts

@router.get("/posts")
def list_scheduled_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ScheduledPost).order_by(ScheduledPost.scheduled_time.asc()).all()

@router.post("/posts")
def create_scheduled_post(post_in: SchedulePostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    clip = db.query(Clip).filter(Clip.id == post_in.clip_id).first()
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
        
    new_post = ScheduledPost(
        clip_id=post_in.clip_id,
        platform=post_in.platform,
        scheduled_time=post_in.scheduled_time,
        caption=post_in.caption or clip.hook_sentence,
        hashtags=post_in.hashtags or "#ai #viral #shorts #clipser",
        status="scheduled"
    )
    clip.is_scheduled = True
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post
