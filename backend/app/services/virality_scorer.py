import re
import math
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Power words that drive engagement
POWER_WORDS = {
    "secret", "hack", "truth", "nobody", "everyone", "mistake", "actually",
    "surprising", "shocking", "insane", "incredible", "never", "always",
    "wrong", "right", "best", "worst", "how", "why", "what", "stop",
    "start", "billion", "million", "money", "rich", "poor", "free",
    "breakthrough", "revolutionary", "banned", "exposed", "hidden",
    "simple", "easy", "hard", "impossible", "genius", "stupid", "crazy",
    "changed", "forever", "believe", "unbelievable", "dead", "alive",
    "future", "ai", "chatgpt", "openai", "google", "elon", "musk"
}

HOOK_PATTERNS = [
    (r"^(why|how|what)\b", 15),
    (r"\b(nobody|no one)\b.*\b(believed|knew|expected)\b", 12),
    (r"\b(secret|hack|trick)\b", 10),
    (r"\b(stop|never|don't)\b.*\b(doing|say)\b", 10),
    (r"\b(this|here'?s)\b.*\b(changed|change)\b", 8),
    (r"\b\d+\b", 5),
]


class ViralityScorerService:
    """
    Real heuristic virality scoring based on:
    - Hook strength (first 3 seconds)
    - Pacing (words per second)
    - Power word density
    - Segment duration (sweet spot 15-60s)
    - Pattern matching for viral formats
    """

    def score_segment(self, text: str, duration: float, is_first_segment: bool = False) -> Dict[str, Any]:
        score = 50
        reasons = []

        words = text.split()
        word_count = len(words)

        # 1. Pacing
        if duration > 0:
            wps = word_count / duration
            if 2.5 <= wps <= 4.0:
                score += 10
                reasons.append("Ideal speaking pace")
            elif wps > 4.0:
                score += 5
                reasons.append("Fast-paced energy")

        # 2. Duration sweet spot
        if 15 <= duration <= 60:
            score += 10
            reasons.append(f"Optimal clip length ({duration:.0f}s)")
        elif duration < 10:
            score -= 5
        elif duration > 90:
            score -= 10

        # 3. Power word density
        lower_words = set(w.lower().strip(".,!?'\"") for w in words)
        power_hits = lower_words & POWER_WORDS
        power_score = min(len(power_hits) * 4, 20)
        score += power_score
        if power_hits:
            reasons.append(f"Power words: {', '.join(list(power_hits)[:3])}")

        # 4. Hook pattern matching
        text_lower = text.lower()
        for pattern, points in HOOK_PATTERNS:
            if re.search(pattern, text_lower):
                score += points
                reasons.append("Hook pattern detected")
                break

        # 5. First segment bonus
        if is_first_segment:
            score += 5
            reasons.append("Strong opening position")

        # 6. Sentence count
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        if len(sentences) <= 3:
            score += 5
            reasons.append("Concise and punchy")

        score = max(0, min(100, score))

        return {
            "score": score,
            "reasons": reasons,
            "power_words": list(power_hits),
            "word_count": word_count,
            "duration": duration
        }

    def generate_hook(self, text: str) -> str:
        text = text.strip()
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        if sentences:
            hook = sentences[0]
        else:
            hook = text
        words = hook.split()[:8]
        hook = " ".join(words).upper()
        hook = re.sub(r'[^\w\s]', '', hook).strip()
        return hook if hook else "VIRAL MOMENT"

    def analyze_and_rank_clips(self, title: str, transcript_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        logger.info(f"Scoring clips for: {title}")
        segments = transcript_data.get("segments", [])

        if not segments:
            logger.warning("No transcript segments to score.")
            return []

        candidates = []
        for i, seg in enumerate(segments):
            text = seg.get("text", "")
            start = seg.get("start", 0.0)
            end = seg.get("end", start + 30.0)
            duration = end - start

            if duration < 5 or not text.strip():
                continue

            scoring = self.score_segment(text, duration, is_first_segment=(i == 0))
            hook = self.generate_hook(text)

            candidates.append({
                "title": hook,
                "hook_sentence": hook,
                "virality_score": scoring["score"],
                "virality_explanation": ". ".join(scoring["reasons"]) + ".",
                "start_time": round(start, 2),
                "end_time": round(end, 2),
                "duration": round(duration, 2),
                "active_speaker_x": 0.5,
                "text": text,
                "power_words": scoring["power_words"]
            })

        candidates.sort(key=lambda c: c["virality_score"], reverse=True)
        return candidates[:20]


virality_scorer = ViralityScorerService()
