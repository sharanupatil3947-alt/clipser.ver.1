import os
import json
import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)


class BrandKit:
    """Stores a user's brand kit configuration."""

    def __init__(self, user_id: int, name: str = "Default",
                 primary_color: str = "#00FFFF", accent_color: str = "#FF00FF",
                 font_family: str = "Arial", logo_path: Optional[str] = None):
        self.user_id = user_id
        self.name = name
        self.primary_color = primary_color
        self.accent_color = accent_color
        self.font_family = font_family
        self.logo_path = logo_path

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "primary_color": self.primary_color,
            "accent_color": self.accent_color,
            "font_family": self.font_family,
            "logo_path": self.logo_path
        }


class BrandService:
    """Manages brand kits stored as JSON files per user."""

    BRAND_DIR = os.path.join(settings.STORAGE_DIR, "brand_kits")

    def __init__(self):
        os.makedirs(self.BRAND_DIR, exist_ok=True)

    def _brand_file(self, user_id: int) -> str:
        return os.path.join(self.BRAND_DIR, f"user_{user_id}_brand.json")

    def save_brand_kit(self, kit: BrandKit) -> Dict[str, Any]:
        path = self._brand_file(kit.user_id)
        data = kit.to_dict()
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
        logger.info(f"Brand kit saved for user {kit.user_id}")
        return data

    def get_brand_kit(self, user_id: int) -> Optional[Dict[str, Any]]:
        path = self._brand_file(user_id)
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
        return None

    def save_logo(self, user_id: int, logo_bytes: bytes, filename: str) -> str:
        logo_dir = os.path.join(self.BRAND_DIR, f"user_{user_id}")
        os.makedirs(logo_dir, exist_ok=True)
        logo_path = os.path.join(logo_dir, filename)
        with open(logo_path, "wb") as f:
            f.write(logo_bytes)
        return logo_path


brand_service = BrandService()
