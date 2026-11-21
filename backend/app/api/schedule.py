import os
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.social import ScheduledPost, SocialAccount
from app.models.clip import Clip
from app.services.social_scheduler import social_scheduler
from pydantic import BaseModel

router = APIRouter(prefix="/schedule", tags=["Social Scheduler"])


# ---- Schemas ----
class SchedulePostIn(BaseModel):
    clip_id: str
    platform: str
    scheduled_time: datetime
    caption: Optional[str] = ""
    hashtags: Optional[str] = "#viral #shorts #clipser #ai"

class ConnectAccountIn(BaseModel):
    platform: str
    account_name: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None

SUPPORTED_PLATFORMS = ["youtube", "tiktok", "instagram", "linkedin"]


# ---- Endpoints ----

@router.get("/accounts")
def get_social_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    accounts = db.query(SocialAccount).filter(SocialAccount.user_id == current_user.id).all()
    # Seed demo connected accounts if none exist
    if not accounts:
        demo_accounts = [
            SocialAccount(user_id=current_user.id, platform="youtube",   account_name="Clipser Shorts",    status="connected"),
            SocialAccount(user_id=current_user.id, platform="tiktok",    account_name="@clipser_official", status="connected"),
            SocialAccount(user_id=current_user.id, platform="instagram", account_name="clipser_reels",     status="connected"),
            SocialAccount(user_id=current_user.id, platform="linkedin",  account_name="Clipser AI",        status="connected"),
        ]
        db.add_all(demo_accounts)
        db.commit()
        accounts = demo_accounts

    return [
        {
            "id": a.id,
            "platform": a.platform,
            "account_name": a.account_name,
            "status": a.status,
            "connected_at": a.connected_at.isoformat() if a.connected_at else None
        }
        for a in accounts
    ]


@router.post("/accounts")
def connect_account(
    payload: ConnectAccountIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if payload.platform not in SUPPORTED_PLATFORMS:
        raise HTTPException(400, f"Unsupported platform. Choose from: {SUPPORTED_PLATFORMS}")

    db.query(SocialAccount).filter(
        SocialAccount.user_id == current_user.id,
        SocialAccount.platform == payload.platform
    ).delete()
    account = SocialAccount(
        user_id=current_user.id,
        platform=payload.platform,
        account_name=payload.account_name,
        access_token=payload.access_token,
        refresh_token=payload.refresh_token,
        status="connected"
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return {
        "id": account.id,
        "platform": account.platform,
        "account_name": account.account_name,
        "status": account.status
    }


@router.delete("/accounts/{platform}")
def disconnect_account(
    platform: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = db.query(SocialAccount).filter(
        SocialAccount.user_id == current_user.id,
        SocialAccount.platform == platform
    ).delete()
    db.commit()
    return {"deleted": deleted, "platform": platform}


@router.get("/posts")
def list_scheduled_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    posts = db.query(ScheduledPost).order_by(ScheduledPost.scheduled_time.asc()).all()
    if not posts:
        sample_posts = [
            ScheduledPost(
                clip_id="clip_secret_01",
                platform="tiktok",
                scheduled_time=datetime.utcnow() + timedelta(hours=3),
                caption="THE COMPOUNDING CAREER SECRET",
                hashtags="#career #growth #success #ai",
                status="scheduled"
            ),
            ScheduledPost(
                clip_id="clip_advice_02",
                platform="instagram",
                scheduled_time=datetime.utcnow() + timedelta(days=1),
                caption="WHY YOU SHOULD IGNORE ADVICE",
                hashtags="#advice #mindset #motivation",
                status="scheduled"
            ),
            ScheduledPost(
                clip_id="clip_chatgpt_03",
                platform="youtube",
                scheduled_time=datetime.utcnow() + timedelta(days=2),
                caption="WHY NOBODY BELIEVED CHATGPT",
                hashtags="#chatgpt #tech #startups",
                status="scheduled"
            )
        ]
        db.add_all(sample_posts)
        db.commit()
        posts = sample_posts

    result = []
    for p in posts:
        clip_title = p.clip.title if (hasattr(p, 'clip') and p.clip) else p.caption
        virality_score = p.clip.virality_score if (hasattr(p, 'clip') and p.clip) else 92
        result.append({
            "id": p.id,
            "clip_id": p.clip_id,
            "platform": p.platform,
            "scheduled_time": p.scheduled_time.isoformat() if p.scheduled_time else None,
            "caption": p.caption,
            "hashtags": p.hashtags,
            "status": p.status,
            "published_post_url": p.published_post_url,
            "clip_title": clip_title,
            "virality_score": virality_score,
            "created_at": p.created_at.isoformat() if p.created_at else None
        })
    return result


@router.post("/posts")
def create_scheduled_post(
    post_in: SchedulePostIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if post_in.platform not in SUPPORTED_PLATFORMS:
        raise HTTPException(400, f"Unsupported platform. Choose from: {SUPPORTED_PLATFORMS}")

    clip = db.query(Clip).filter(Clip.id == post_in.clip_id).first()
    if not clip:
        raise HTTPException(404, "Clip not found")

    existing = db.query(ScheduledPost).filter(
        ScheduledPost.clip_id == post_in.clip_id,
        ScheduledPost.platform == post_in.platform,
        ScheduledPost.status.in_(["scheduled", "publishing"])
    ).first()
    if existing:
        raise HTTPException(409, f"Clip is already scheduled for {post_in.platform}")

    new_post = ScheduledPost(
        user_id=current_user.id,
        clip_id=post_in.clip_id,
        platform=post_in.platform,
        scheduled_time=post_in.scheduled_time,
        caption=post_in.caption or clip.hook_sentence or clip.title,
        hashtags=post_in.hashtags or "#viral #shorts #clipser #ai",
        status="scheduled"
    )
    clip.is_scheduled = True
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    if post_in.scheduled_time <= datetime.utcnow():
        account = db.query(SocialAccount).filter(
            SocialAccount.user_id == current_user.id,
            SocialAccount.platform == post_in.platform
        ).first()
        access_token = account.access_token if account else None
        video_path = None
        if clip.video_url and clip.video_url.startswith("/storage/"):
            from app.core.config import settings
            video_path = os.path.join(settings.STORAGE_DIR, clip.video_url.replace("/storage/", "", 1))

        background_tasks.add_task(
            social_scheduler.publish_clip_async,
            platform=post_in.platform,
            clip_id=post_in.clip_id,
            caption=new_post.caption,
            hashtags=new_post.hashtags,
            video_path=video_path,
            access_token=access_token,
            post_id=new_post.id,
            db=db
        )

    return {
        "id": new_post.id,
        "clip_id": new_post.clip_id,
        "platform": new_post.platform,
        "scheduled_time": new_post.scheduled_time.isoformat() if new_post.scheduled_time else None,
        "caption": new_post.caption,
        "hashtags": new_post.hashtags,
        "status": new_post.status,
        "published_post_url": new_post.published_post_url
    }


@router.post("/posts/{post_id}/publish-now")
def publish_now(
    post_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(ScheduledPost).filter(ScheduledPost.id == post_id).first()
    if not post:
        raise HTTPException(404, "Scheduled post not found")

    clip = db.query(Clip).filter(Clip.id == post.clip_id).first()
    account = db.query(SocialAccount).filter(
        SocialAccount.user_id == current_user.id,
        SocialAccount.platform == post.platform
    ).first()

    access_token = account.access_token if account else None
    video_path = None
    if clip and clip.video_url and clip.video_url.startswith("/storage/"):
        from app.core.config import settings
        video_path = os.path.join(settings.STORAGE_DIR, clip.video_url.replace("/storage/", "", 1))

    background_tasks.add_task(
        social_scheduler.publish_clip_async,
        platform=post.platform,
        clip_id=post.clip_id,
        caption=post.caption,
        hashtags=post.hashtags,
        video_path=video_path,
        access_token=access_token,
        post_id=post.id,
        db=db
    )
    return {"message": "Publishing started", "post_id": post_id}


@router.delete("/posts/{post_id}")
def delete_scheduled_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(ScheduledPost).filter(ScheduledPost.id == post_id).first()
    if not post:
        raise HTTPException(404, "Post not found")
    db.delete(post)
    db.commit()
    return {"deleted": post_id}
