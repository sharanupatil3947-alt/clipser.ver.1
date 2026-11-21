import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, projects, clips, schedule, analytics, websocket, brand, templates, export
# CRM removed per user request

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("clipser")

# Initialize all DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=f"{settings.PROJECT_NAME} API",
    version=settings.VERSION,
    description="Clipser — AI Video Repurposing Platform. Free Pro Unlimited.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS — allow all origins for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for storage (clips, thumbnails, uploads, brand kits)
import os
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
app.mount("/storage", StaticFiles(directory=settings.STORAGE_DIR), name="storage")

# ── Routers ──
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(clips.router, prefix=settings.API_V1_STR)
app.include_router(schedule.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(brand.router, prefix=settings.API_V1_STR)
app.include_router(templates.router, prefix=settings.API_V1_STR)
app.include_router(export.router, prefix=settings.API_V1_STR)
app.include_router(websocket.router)


@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "documentation": "/docs",
        "features": [
            "AI Transcription (Whisper — local, free)",
            "Real Face Tracking (MediaPipe / OpenCV)",
            "Heuristic Virality Scoring (0-100)",
            "Animated Karaoke Captions (ASS/FFmpeg)",
            "Smart 9:16 / 1:1 / 4:5 Reframing (FFmpeg)",
            "Multi-Platform Social Scheduler (YouTube, TikTok, Instagram, LinkedIn)",
            "Brand Kit (logo, colors, fonts)",
            "7 Clip Templates",
            "Multi-Resolution Export (1080p / 720p / 480p)",
            "Public Sign-Up + Google OAuth",
            "Zero Subscription — Free Pro Unlimited"
        ]
    }


@app.on_event("startup")
def seed_initial_demo_project():
    """
    Seeds demo data matching ScaleReach.ai screenshot if the DB is empty.
    """
    from sqlalchemy.orm import Session
    from app.core.database import SessionLocal
    from app.models.user import User
    from app.models.project import Project
    from app.models.clip import Clip
    from app.core.security import get_password_hash

    db: Session = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "demo@clipser.ai").first()
        if not demo_user:
            demo_user = User(
                email="demo@clipser.ai",
                name="Clipser Demo",
                hashed_password=get_password_hash("clipser2026"),
                is_pro=True,
                plan_tier="pro_unlimited",
                source_minutes_remaining=999999
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

        # Seed the pre-filled login user (matches frontend login form defaults)
        prefilled_user = db.query(User).filter(User.email == "sharanupatil3947@gmail.com").first()
        if not prefilled_user:
            prefilled_user = User(
                email="sharanupatil3947@gmail.com",
                name="Sharana Patil",
                hashed_password=get_password_hash("clipser2026"),
                is_pro=True,
                plan_tier="pro_unlimited",
                source_minutes_remaining=999999,
                auth_provider="email"
            )
            db.add(prefilled_user)
            db.commit()
            logger.info("Pre-filled login user seeded: sharanupatil3947@gmail.com")

        demo_proj = db.query(Project).filter(Project.id == "QILfShrb7StRrlPEQqpoy").first()
        if not demo_proj:
            demo_proj = Project(
                id="QILfShrb7StRrlPEQqpoy",
                user_id=demo_user.id,
                title="Sam Altman On AI Revolution, Superintelligence & Future Of Humanity | FO583 Raj Shamani",
                source_url="https://www.youtube.com/watch?v=sample_sam_altman",
                source_type="youtube",
                thumbnail_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
                duration_seconds=4081.0,
                duration_formatted="68:01",
                status="ready",
                progress=100,
                current_step="17 clips generated with top score 94"
            )
            db.add(demo_proj)
            db.commit()

            demo_clips = [
                Clip(
                    id="clip_secret_01",
                    project_id="QILfShrb7StRrlPEQqpoy",
                    title="THE COMPOUNDING CAREER SECRET",
                    hook_sentence="THE COMPOUNDING\nCAREER SECRET",
                    virality_score=94,
                    virality_explanation="Curiosity hook with immediate retention lock.",
                    start_time=12.0, end_time=47.0, duration=35.0,
                    aspect_ratio="9:16",
                    video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    thumbnail_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                    caption_style="karaoke_cyan_glow", active_speaker_x=0.52
                ),
                Clip(
                    id="clip_advice_02",
                    project_id="QILfShrb7StRrlPEQqpoy",
                    title="WHY YOU SHOULD IGNORE ADVICE",
                    hook_sentence="WHY YOU SHOULD\nIGNORE ADVICE",
                    virality_score=92,
                    virality_explanation="Provocative contrarian statement.",
                    start_time=95.0, end_time=136.0, duration=41.0,
                    aspect_ratio="9:16",
                    video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                    thumbnail_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                    caption_style="karaoke_cyan_glow", active_speaker_x=0.48
                ),
                Clip(
                    id="clip_chatgpt_03",
                    project_id="QILfShrb7StRrlPEQqpoy",
                    title="WHY NOBODY BELIEVED CHATGPT",
                    hook_sentence="WHY NOBODY BELIEVED\nCHATGPT",
                    virality_score=90,
                    virality_explanation="Dramatic underdog narrative.",
                    start_time=210.0, end_time=251.0, duration=41.0,
                    aspect_ratio="9:16",
                    video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                    thumbnail_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
                    caption_style="karaoke_cyan_glow", active_speaker_x=0.50
                )
            ]
            db.add_all(demo_clips)
            db.commit()
            logger.info("Demo data seeded successfully!")
    except Exception as e:
        logger.error(f"Seed error: {e}")
    finally:
        db.close()
