import os
import logging
import asyncio
import httpx
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

PLATFORM_CONFIGS = {
    "youtube": {"name": "YouTube Shorts", "color": "#FF0000", "icon": "▶"},
    "tiktok":  {"name": "TikTok",         "color": "#010101", "icon": "♪"},
    "instagram": {"name": "Instagram Reels", "color": "#E1306C", "icon": "◈"},
    "linkedin": {"name": "LinkedIn",       "color": "#0A66C2", "icon": "in"},
}


class SocialSchedulerService:
    """
    Social scheduling service.
    - Saves posts to DB as 'scheduled'
    - On publish time, calls real platform APIs if OAuth tokens are present
    - Falls back to 'simulated_published' status if no real token (for demo mode)
    """

    async def publish_clip_async(
        self,
        platform: str,
        clip_id: str,
        caption: str,
        hashtags: str,
        video_path: Optional[str],
        access_token: Optional[str],
        post_id: Optional[int] = None,
        db=None
    ) -> Dict[str, Any]:
        logger.info(f"Publishing clip {clip_id} to {platform}")
        cfg = PLATFORM_CONFIGS.get(platform, {"name": platform})

        # Update DB status to 'publishing' if db provided
        if db and post_id:
            from app.models.social import ScheduledPost
            post = db.query(ScheduledPost).filter(ScheduledPost.id == post_id).first()
            if post:
                post.status = "publishing"
                db.commit()

        result_url = None
        status = "failed"

        # If a real access token is provided, attempt platform API
        if access_token and video_path and os.path.isfile(video_path):
            try:
                if platform == "youtube":
                    result_url = await self._publish_youtube(access_token, caption, hashtags, video_path)
                elif platform == "tiktok":
                    result_url = await self._publish_tiktok(access_token, caption, hashtags, video_path)
                elif platform == "instagram":
                    result_url = await self._publish_instagram(access_token, caption, hashtags, video_path)
                elif platform == "linkedin":
                    result_url = await self._publish_linkedin(access_token, caption, hashtags, video_path)
                if result_url:
                    status = "published"
            except Exception as e:
                logger.error(f"Real publish failed for {platform}: {e}")
                status = "failed"
        else:
            # Demo mode: simulate success (no token or video not on disk yet)
            logger.info(f"Demo mode: simulating publish to {platform}")
            await asyncio.sleep(0.5)
            result_url = f"https://{platform}.com/clipser_{clip_id[:8]}"
            status = "simulated_published"

        # Update DB final status
        if db and post_id:
            from app.models.social import ScheduledPost
            post = db.query(ScheduledPost).filter(ScheduledPost.id == post_id).first()
            if post:
                post.status = status
                post.published_post_url = result_url
                db.commit()

        return {
            "status": status,
            "platform": platform,
            "platform_name": cfg.get("name", platform),
            "post_url": result_url,
            "clip_id": clip_id,
            "published_at": datetime.utcnow().isoformat(),
        }

    # Legacy sync wrapper
    def publish_clip(self, platform: str, clip_id: str, caption: str,
                     hashtags: str, access_token: Optional[str] = None,
                     video_path: Optional[str] = None) -> Dict[str, Any]:
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(
                self.publish_clip_async(platform, clip_id, caption, hashtags, video_path, access_token)
            )
        finally:
            loop.close()

    # ---- Platform-specific publish methods ----

    async def _publish_youtube(self, token: str, caption: str, hashtags: str, video_path: str) -> str:
        """Upload video to YouTube Shorts via YouTube Data API v3."""
        url = "https://www.googleapis.com/upload/youtube/v3/videos"
        params = {"uploadType": "multipart", "part": "snippet,status"}
        metadata = {
            "snippet": {
                "title": caption[:100],
                "description": f"{caption}\n\n{hashtags}",
                "tags": [h.strip("#") for h in hashtags.split() if h.startswith("#")],
                "categoryId": "22"
            },
            "status": {"privacyStatus": "public", "selfDeclaredMadeForKids": False}
        }
        async with httpx.AsyncClient(timeout=300) as client:
            with open(video_path, "rb") as f:
                video_bytes = f.read()
            resp = await client.post(
                url,
                headers={"Authorization": f"Bearer {token}"},
                params=params,
                content=video_bytes
            )
            if resp.status_code in (200, 201):
                video_id = resp.json().get("id", "")
                return f"https://youtube.com/shorts/{video_id}"
        raise Exception(f"YouTube upload failed: {resp.status_code}")

    async def _publish_tiktok(self, token: str, caption: str, hashtags: str, video_path: str) -> str:
        """Publish video to TikTok via Content Posting API."""
        async with httpx.AsyncClient(timeout=300) as client:
            with open(video_path, "rb") as f:
                video_bytes = f.read()
            resp = await client.post(
                "https://open.tiktokapis.com/v2/post/publish/video/init/",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                json={
                    "post_info": {
                        "title": f"{caption} {hashtags}"[:150],
                        "privacy_level": "PUBLIC_TO_EVERYONE"
                    },
                    "source_info": {"source": "FILE_UPLOAD", "video_size": len(video_bytes)}
                }
            )
            if resp.status_code == 200:
                publish_id = resp.json().get("data", {}).get("publish_id", "")
                return f"https://tiktok.com/@me/video/{publish_id}"
        raise Exception(f"TikTok upload failed: {resp.status_code}")

    async def _publish_instagram(self, token: str, caption: str, hashtags: str, video_path: str) -> str:
        """Publish to Instagram Reels via Meta Graph API."""
        # Step 1: Upload video container
        async with httpx.AsyncClient(timeout=300) as client:
            resp = await client.post(
                "https://graph.instagram.com/me/media",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "media_type": "REELS",
                    "caption": f"{caption}\n{hashtags}",
                    "share_to_feed": True,
                }
            )
            if resp.status_code == 200:
                creation_id = resp.json().get("id")
                # Step 2: Publish the container
                pub_resp = await client.post(
                    "https://graph.instagram.com/me/media_publish",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"creation_id": creation_id}
                )
                if pub_resp.status_code == 200:
                    media_id = pub_resp.json().get("id", "")
                    return f"https://instagram.com/reel/{media_id}"
        raise Exception(f"Instagram upload failed: {resp.status_code}")

    async def _publish_linkedin(self, token: str, caption: str, hashtags: str, video_path: str) -> str:
        """Publish to LinkedIn via LinkedIn API."""
        async with httpx.AsyncClient(timeout=300) as client:
            resp = await client.post(
                "https://api.linkedin.com/v2/ugcPosts",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                json={
                    "author": "urn:li:person:me",
                    "lifecycleState": "PUBLISHED",
                    "specificContent": {
                        "com.linkedin.ugc.ShareContent": {
                            "shareCommentary": {"text": f"{caption}\n{hashtags}"},
                            "shareMediaCategory": "VIDEO"
                        }
                    },
                    "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
                }
            )
            if resp.status_code in (200, 201):
                post_id = resp.headers.get("x-restli-id", "me")
                return f"https://linkedin.com/feed/update/{post_id}"
        raise Exception(f"LinkedIn upload failed: {resp.status_code}")


social_scheduler = SocialSchedulerService()
