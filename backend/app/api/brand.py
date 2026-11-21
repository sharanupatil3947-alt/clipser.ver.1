from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.core.security import get_current_user
from app.services.brand_service import brand_service, BrandKit

router = APIRouter(prefix="/brand", tags=["Brand Kit"])


@router.get("")
def get_brand_kit(current_user=Depends(get_current_user)):
    kit = brand_service.get_brand_kit(current_user.id)
    if kit:
        return kit
    return {
        "user_id": current_user.id,
        "name": "Default",
        "primary_color": "#00FFFF",
        "accent_color": "#FF00FF",
        "font_family": "Arial",
        "logo_path": None
    }


@router.post("")
async def save_brand_kit(
    name: str = Form("Default"),
    primary_color: str = Form("#00FFFF"),
    accent_color: str = Form("#FF00FF"),
    font_family: str = Form("Arial"),
    logo: Optional[UploadFile] = File(None),
    current_user=Depends(get_current_user),
):
    logo_path = None
    if logo:
        content = await logo.read()
        logo_path = brand_service.save_logo(current_user.id, content, logo.filename)

    kit = BrandKit(
        user_id=current_user.id,
        name=name,
        primary_color=primary_color,
        accent_color=accent_color,
        font_family=font_family,
        logo_path=logo_path,
    )
    return brand_service.save_brand_kit(kit)
