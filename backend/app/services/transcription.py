import os
import json
import logging
import subprocess
import tempfile
from pathlib import Path
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)


class TranscriptionService:
    """
    Real transcription using OpenAI Whisper.
    Falls back to faster-whisper if available, then to openai-whisper,
    then to ffmpeg-based silence detection as last resort.
    """

    def __init__(self):
        self._model = None
        self._backend = None

    def _load_model(self):
        if self._model is not None:
            return

        # Try faster-whisper first (CTranslate2 optimised)
        try:
            from faster_whisper import WhisperModel
            self._model = WhisperModel("base", device="auto", compute_type="auto")
            self._backend = "faster_whisper"
            logger.info("Transcription backend: faster-whisper (CTranslate2)")
            return
        except Exception as e:
            logger.debug(f"faster-whisper not available: {e}")

        # Try openai-whisper
        try:
            import whisper
            self._model = whisper.load_model("base")
            self._backend = "openai_whisper"
            logger.info("Transcription backend: openai-whisper")
            return
        except Exception as e:
            logger.debug(f"openai-whisper not available: {e}")

        # Fallback: use ffmpeg silence detection
        self._backend = "fallback"
        logger.warning("No Whisper model available. Using FFmpeg silence-based segmentation.")

    def _extract_audio(self, video_path: str) -> str:
        """Extract audio to a temp WAV file for Whisper."""
        tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        tmp.close()
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", video_path, "-vn", "-acodec", "pcm_s16le",
                 "-ar", "16000", "-ac", "1", tmp.name],
                capture_output=True, timeout=300
            )
        except Exception as e:
            logger.error(f"Audio extraction failed: {e}")
        return tmp.name

    def transcribe(self, video_path: str, title: str = "") -> Dict[str, Any]:
        """
        Returns: {"language": str, "segments": [{"start": float, "end": float, "text": str, "words": [...]}]}
        """
        logger.info(f"Transcribing: {video_path}")
        self._load_model()

        if not video_path or not os.path.isfile(video_path):
            logger.warning(f"Video file not found: {video_path}. Returning empty transcript.")
            return {"language": "en", "segments": []}

        audio_path = self._extract_audio(video_path)

        try:
            if self._backend == "faster_whisper":
                return self._transcribe_faster_whisper(audio_path)
            elif self._backend == "openai_whisper":
                return self._transcribe_openai_whisper(audio_path)
            else:
                return self._transcribe_fallback(video_path)
        finally:
            try:
                os.unlink(audio_path)
            except Exception:
                pass

    def _transcribe_faster_whisper(self, audio_path: str) -> Dict[str, Any]:
        segments_iter, info = self._model.transcribe(audio_path, word_timestamps=True)
        segments = []
        for seg in segments_iter:
            words = []
            if seg.words:
                for w in seg.words:
                    words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
            segments.append({
                "start": round(seg.start, 3),
                "end": round(seg.end, 3),
                "text": seg.text.strip(),
                "words": words
            })
        return {"language": info.language, "segments": segments}

    def _transcribe_openai_whisper(self, audio_path: str) -> Dict[str, Any]:
        result = self._model.transcribe(audio_path, word_timestamps=True)
        segments = []
        for seg in result.get("segments", []):
            words = []
            for w in seg.get("words", []):
                words.append({"word": w["word"].strip(), "start": round(w["start"], 3), "end": round(w["end"], 3)})
            segments.append({
                "start": round(seg["start"], 3),
                "end": round(seg["end"], 3),
                "text": seg["text"].strip(),
                "words": words
            })
        return {"language": result.get("language", "en"), "segments": segments}

    def _transcribe_fallback(self, video_path: str) -> Dict[str, Any]:
        """Use FFmpeg silence detection to find speech segments."""
        try:
            result = subprocess.run(
                ["ffmpeg", "-i", video_path, "-af",
                 "silencedetect=noise=-30dB:d=0.5", "-f", "null", "-"],
                capture_output=True, text=True, timeout=300
            )
            lines = result.stderr
            silence_starts = []
            silence_ends = []
            for line in lines.splitlines():
                if "silence_start:" in line:
                    try:
                        ts = float(line.split("silence_start:")[1].strip().split()[0])
                        silence_starts.append(ts)
                    except Exception:
                        pass
                if "silence_end:" in line:
                    try:
                        ts = float(line.split("silence_end:")[1].strip().split()[0])
                        silence_ends.append(ts)
                    except Exception:
                        pass

            segments = []
            prev_end = 0.0
            for i, ss in enumerate(silence_starts):
                if ss - prev_end > 0.5:
                    segments.append({
                        "start": round(prev_end, 3),
                        "end": round(ss, 3),
                        "text": f"[Speech segment {len(segments) + 1}]",
                        "words": []
                    })
                if i < len(silence_ends):
                    prev_end = silence_ends[i]

            return {"language": "en", "segments": segments}
        except Exception as e:
            logger.error(f"Fallback transcription failed: {e}")
            return {"language": "en", "segments": []}


transcription_service = TranscriptionService()
