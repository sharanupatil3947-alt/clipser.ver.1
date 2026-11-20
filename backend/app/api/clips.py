from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.clip import Clip
from app.schemas.project import ClipResponse

router = APIRouter(prefix="/clips", tags=["Clips"])

@router.get("/{clip_id}", response_model=ClipResponse)
def get_clip(clip_id: str, db: Session = Depends(get_db)):
    clip = db.query(Clip).filter(Clip.id == clip_id).first()
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
    return clip

@router.patch("/{clip_id}")
def update_clip(
    clip_id: str,
    title: Optional[str] = Body(None),
    hook_sentence: Optional[str] = Body(None),
    aspect_ratio: Optional[str] = Body(None),
    caption_style: Optional[str] = Body(None),
    is_favorite: Optional[bool] = Body(None),
    db: Session = Depends(get_db)
):
    clip = db.query(Clip).filter(Clip.id == clip_id).first()
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
        
    if title is not None:
        clip.title = title
    if hook_sentence is not None:
        clip.hook_sentence = hook_sentence
    if aspect_ratio is not None:
        clip.aspect_ratio = aspect_ratio
    if caption_style is not None:
        clip.caption_style = caption_style
    if is_favorite is not None:
        clip.is_favorite = is_favorite
        
    db.commit()
    db.refresh(clip)
    return clip
