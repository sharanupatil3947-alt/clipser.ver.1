from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    return {
        "total_views": 4280500,
        "views_growth": "+34.8%",
        "avg_virality_score": 92.4,
        "avg_retention_rate": "88.6%",
        "total_clips_generated": 142,
        "total_hours_saved": 86.5,
        "platform_breakdown": {
            "tiktok": {"views": 1850000, "shares": 92000, "engagement": "9.4%"},
            "instagram_reels": {"views": 1420000, "shares": 64000, "engagement": "8.7%"},
            "youtube_shorts": {"views": 1010500, "shares": 48000, "engagement": "11.2%"}
        },
        "recent_performance_curve": [
            {"day": "Mon", "views": 420000},
            {"day": "Tue", "views": 580000},
            {"day": "Wed", "views": 720000},
            {"day": "Thu", "views": 690000},
            {"day": "Fri", "views": 850000},
            {"day": "Sat", "views": 980000},
            {"day": "Sun", "views": 1040500}
        ]
    }
