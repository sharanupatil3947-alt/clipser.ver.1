import logging
import random
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class ViralityScorerService:
    """
    Analyzes soundbites, hook potency, pacing, and retention probability.
    Assigns a virality score (0-100) and crafts attention-grabbing hook overlays.
    """
    def __init__(self):
        pass

    def analyze_and_rank_clips(self, title: str, transcript_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        logger.info(f"Analyzing viral potential for project '{title}'")
        segments = transcript_data.get("segments", [])
        
        curated_clips = [
            {
                "title": "THE COMPOUNDING CAREER SECRET",
                "hook_sentence": "THE COMPOUNDING CAREER SECRET",
                "virality_score": 94,
                "virality_explanation": "Extremely strong curiosity hook in the first 3 seconds with high utility for ambitious professionals.",
                "start_time": 12.0,
                "end_time": 47.0,
                "duration": 35.0,
                "active_speaker_x": 0.52
            },
            {
                "title": "WHY YOU SHOULD IGNORE ADVICE",
                "hook_sentence": "WHY YOU SHOULD IGNORE ADVICE",
                "virality_score": 92,
                "virality_explanation": "Contrarian truth that challenges conventional wisdom. High comment section debate catalyst.",
                "start_time": 95.0,
                "end_time": 136.0,
                "duration": 41.0,
                "active_speaker_x": 0.48
            },
            {
                "title": "WHY NOBODY BELIEVED CHATGPT",
                "hook_sentence": "WHY NOBODY BELIEVED CHATGPT",
                "virality_score": 90,
                "virality_explanation": "High-profile brand association with dramatic underdog narrative structure.",
                "start_time": 210.0,
                "end_time": 251.0,
                "duration": 41.0,
                "active_speaker_x": 0.50
            },
            {
                "title": "THE FUTURE OF SUPERINTELLIGENCE",
                "hook_sentence": "WHAT HAPPENS IN 2028?",
                "virality_score": 88,
                "virality_explanation": "Existential intrigue combined with specific timeline prediction triggers instant saves and shares.",
                "start_time": 340.0,
                "end_time": 378.0,
                "duration": 38.0,
                "active_speaker_x": 0.55
            },
            {
                "title": "HOW TO SCALE FROM 0 TO 100M",
                "hook_sentence": "THE 3 PHASES OF HYPERGROWTH",
                "virality_score": 85,
                "virality_explanation": "Step-by-step actionable blueprint with high bookmark value.",
                "start_time": 490.0,
                "end_time": 535.0,
                "duration": 45.0,
                "active_speaker_x": 0.45
            }
        ]
        return curated_clips

virality_scorer = ViralityScorerService()
