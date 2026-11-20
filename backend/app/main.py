import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, projects, clips, schedule, crm, analytics, websocket

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("clipser")

# Initialize SQLite/Postgres tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=f"{settings.PROJECT_NAME} API",
    version=settings.VERSION,
    description="High-performance backend for Clipser: AI Video Repurposing, Reframing, Subtitling, and Multi-Platform Distribution.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for storage (clips, thumbnails, uploads)
app.mount("/storage", StaticFiles(directory=settings.STORAGE_DIR), name="storage")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(clips.router, prefix=settings.API_V1_STR)
app.include_router(schedule.router, prefix=settings.API_V1_STR)
app.include_router(crm.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(websocket.router)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "documentation": "/docs",
        "features": [
            "AI Transcription (Whisper)",
            "Dynamic Face Tracking (16:9 -> 9:16 Reframe)",
            "Virality Scoring (0-100)",
            "Animated Karaoke Captions",
            "Multi-Platform Social Scheduler",
            "Bi-Directional CRM Synchronization",
            "Zero Subscription Costs - Free Pro Unlimited"
        ]
    }

@app.on_event("startup")
def seed_initial_demo_project():
    """
    Seeds the exact demo matching ScaleReach.ai if database is empty:
    'Sam Altman On AI Revolution, Superintelligence & Future Of Humanity | FO583 Raj Shamani'
    with 17 clips, top score 94, hook overlays.
    """
    from sqlalchemy.orm import Session
    from app.core.database import SessionLocal
    from app.models.user import User
    from app.models.project import Project
    from app.models.clip import Clip
    from app.core.security import get_password_hash
    
    db: Session = SessionLocal()
    try:
        # Ensure demo user exists
        demo_user = db.query(User).filter(User.email == "sharanupatil3947@gmail.com").first()
        if not demo_user:
            demo_user = User(
                email="sharanupatil3947@gmail.com",
                name="Sharana Patil",
                avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
                hashed_password=get_password_hash("clipser2026"),
                is_pro=True,
                plan_tier="pro_unlimited",
                source_minutes_remaining=999999
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            
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
            
            # Seed 3 high-impact clips matching the user's uploaded screenshot
            demo_clips = [
                Clip(
                    id="clip_secret_01",
                    project_id="QILfShrb7StRrlPEQqpoy",
                    title="THE COMPOUNDING CAREER SECRET",
                    hook_sentence="THE COMPOUNDING\nCAREER SECRET",
                    virality_score=94,
                    virality_explanation="Curiosity hook with immediate retention lock. Addresses high-ambition audience psychology.",
                    start_time=12.0,
                    end_time=47.0,
                    duration=35.0,
                    aspect_ratio="9:16",
                    video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    thumbnail_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                    caption_style="karaoke_cyan_glow",
                    active_speaker_x=0.52
                ),
                Clip(
                    id="clip_advice_02",
                    project_id="QILfShrb7StRrlPEQqpoy",
                    title="WHY YOU SHOULD IGNORE ADVICE",
                    hook_sentence="WHY YOU SHOULD\nIGNORE ADVICE",
                    virality_score=92,
                    virality_explanation="Provocative contrarian statement. Ignites comment section debates and shares.",
                    start_time=95.0,
                    end_time=136.0,
                    duration=41.0,
                    aspect_ratio="9:16",
                    video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                    thumbnail_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                    caption_style="karaoke_cyan_glow",
                    active_speaker_x=0.48
                ),
                Clip(
                    id="clip_chatgpt_03",
                    project_id="QILfShrb7StRrlPEQqpoy",
                    title="WHY NOBODY BELIEVED CHATGPT",
                    hook_sentence="WHY NOBODY BELIEVED\nCHATGPT",
                    virality_score=90,
                    virality_explanation="Dramatic underdog struggle paired with tech giant founder narrative.",
                    start_time=210.0,
                    end_time=251.0,
                    duration=41.0,
                    aspect_ratio="9:16",
                    video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                    thumbnail_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
                    caption_style="karaoke_cyan_glow",
                    active_speaker_x=0.50
                )
            ]
            db.add_all(demo_clips)
            db.commit()
            logger.info("Demo data matching ScaleReach.ai successfully seeded into Clipser database!")
    finally:
        db.close()
