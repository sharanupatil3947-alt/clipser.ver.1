import os
from typing import List

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "Clipser"
        VERSION: str = "1.0.0"
        API_V1_STR: str = "/api/v1"
        SECRET_KEY: str = os.getenv("SECRET_KEY", "clipser_super_secret_jwt_key_2026_low_latency_repurpose")
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./clipser.db")
        STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./storage")
        UPLOADS_DIR: str = os.getenv("UPLOADS_DIR", "./storage/uploads")
        CLIPS_DIR: str = os.getenv("CLIPS_DIR", "./storage/clips")
        THUMBNAILS_DIR: str = os.getenv("THUMBNAILS_DIR", "./storage/thumbnails")
        GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
        GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        BACKEND_CORS_ORIGINS: List[str] = ["*"]
        class Config:
            case_sensitive = True
    settings = Settings()
except Exception:
    class Settings:
        PROJECT_NAME: str = "Clipser"
        VERSION: str = "1.0.0"
        API_V1_STR: str = "/api/v1"
        SECRET_KEY: str = os.getenv("SECRET_KEY", "clipser_super_secret_jwt_key_2026_low_latency_repurpose")
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./clipser.db")
        STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./storage")
        UPLOADS_DIR: str = os.getenv("UPLOADS_DIR", "./storage/uploads")
        CLIPS_DIR: str = os.getenv("CLIPS_DIR", "./storage/clips")
        THUMBNAILS_DIR: str = os.getenv("THUMBNAILS_DIR", "./storage/thumbnails")
        GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
        GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
        GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        BACKEND_CORS_ORIGINS: List[str] = ["*"]
    settings = Settings()


# Ensure directories exist
for d in [settings.STORAGE_DIR, settings.UPLOADS_DIR, settings.CLIPS_DIR, settings.THUMBNAILS_DIR]:
    os.makedirs(d, exist_ok=True)
