import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

TEMPLATES: List[Dict[str, Any]] = [
    {
        "id": "podcast",
        "name": "Podcast",
        "description": "Two-speaker layout with centred crop and clean captions",
        "aspect_ratio": "9:16",
        "caption_style": "bold_white",
        "hook_position": "top",
        "crop_strategy": "center",
    },
    {
        "id": "interview",
        "name": "Interview",
        "description": "Active speaker tracking with karaoke captions",
        "aspect_ratio": "9:16",
        "caption_style": "karaoke_cyan_glow",
        "hook_position": "top",
        "crop_strategy": "face_track",
    },
    {
        "id": "tutorial",
        "name": "Tutorial",
        "description": "Screen-focused crop with minimal captions at the bottom",
        "aspect_ratio": "9:16",
        "caption_style": "minimal",
        "hook_position": "bottom",
        "crop_strategy": "center",
    },
    {
        "id": "gaming",
        "name": "Gaming",
        "description": "High-energy neon captions with fast cuts",
        "aspect_ratio": "9:16",
        "caption_style": "neon",
        "hook_position": "top",
        "crop_strategy": "center",
    },
    {
        "id": "motivational",
        "name": "Motivational",
        "description": "Speaker-centred with shadow captions and bold hooks",
        "aspect_ratio": "9:16",
        "caption_style": "shadow",
        "hook_position": "center",
        "crop_strategy": "face_track",
    },
    {
        "id": "square_social",
        "name": "Square (1:1)",
        "description": "Square format for Instagram feed and LinkedIn",
        "aspect_ratio": "1:1",
        "caption_style": "bold_white",
        "hook_position": "top",
        "crop_strategy": "center",
    },
    {
        "id": "portrait_feed",
        "name": "Portrait (4:5)",
        "description": "4:5 portrait for Instagram feed posts",
        "aspect_ratio": "4:5",
        "caption_style": "minimal",
        "hook_position": "top",
        "crop_strategy": "face_track",
    },
]


class TemplateService:
    def list_templates(self) -> List[Dict[str, Any]]:
        return TEMPLATES

    def get_template(self, template_id: str) -> Dict[str, Any]:
        for t in TEMPLATES:
            if t["id"] == template_id:
                return t
        return TEMPLATES[0]


template_service = TemplateService()
