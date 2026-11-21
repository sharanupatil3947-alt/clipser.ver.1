import os
import logging
from typing import Dict, Any, List, Tuple, Optional

logger = logging.getLogger(__name__)


class FaceTrackerService:
    """
    Real face detection & tracking using MediaPipe (preferred) or OpenCV Haar Cascade.
    Returns per-frame face center coordinates for smart 9:16 cropping.
    """

    def __init__(self):
        self._detector = None
        self._backend = None

    def _load_detector(self):
        if self._detector is not None:
            return

        try:
            import mediapipe as mp
            self._detector = mp.solutions.face_detection.FaceDetection(
                model_selection=1, min_detection_confidence=0.5
            )
            self._backend = "mediapipe"
            logger.info("Face tracking backend: MediaPipe")
            return
        except Exception as e:
            logger.debug(f"MediaPipe not available: {e}")

        try:
            import cv2
            cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            self._detector = cv2.CascadeClassifier(cascade_path)
            self._backend = "opencv_haar"
            logger.info("Face tracking backend: OpenCV Haar Cascade")
            return
        except Exception as e:
            logger.debug(f"OpenCV cascade not available: {e}")

        self._backend = "none"
        logger.warning("No face detection backend available. Using center crop.")

    def track_faces(self, video_path: str, start_time: float = 0.0,
                    end_time: float = -1.0, sample_rate: int = 5
                    ) -> List[Tuple[float, float, float]]:
        """
        Returns list of (timestamp, x_center_normalized, y_center_normalized).
        sample_rate: analyse every Nth frame for speed.
        """
        self._load_detector()

        if not os.path.isfile(video_path):
            logger.warning(f"Video not found: {video_path}")
            return [(0.0, 0.5, 0.4)]

        try:
            import cv2
        except ImportError:
            return [(0.0, 0.5, 0.4)]

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return [(0.0, 0.5, 0.4)]

        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        start_frame = int(start_time * fps)
        end_frame = int(end_time * fps) if end_time > 0 else total_frames

        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
        results = []
        frame_idx = start_frame

        while frame_idx < end_frame and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if (frame_idx - start_frame) % sample_rate == 0:
                ts = frame_idx / fps
                cx, cy = self._detect_face_center(frame)
                results.append((ts, cx, cy))

            frame_idx += 1

        cap.release()

        if not results:
            results = [(0.0, 0.5, 0.4)]

        return results

    def _detect_face_center(self, frame) -> Tuple[float, float]:
        """Returns (x_center, y_center) normalized 0-1."""
        if self._backend == "mediapipe":
            return self._mediapipe_detect(frame)
        elif self._backend == "opencv_haar":
            return self._haar_detect(frame)
        return (0.5, 0.4)

    def _mediapipe_detect(self, frame) -> Tuple[float, float]:
        import cv2
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self._detector.process(rgb)
        if result.detections:
            det = max(result.detections, key=lambda d: d.score[0])
            bbox = det.location_data.relative_bounding_box
            cx = bbox.xmin + bbox.width / 2
            cy = bbox.ymin + bbox.height / 2
            return (max(0.0, min(1.0, cx)), max(0.0, min(1.0, cy)))
        return (0.5, 0.4)

    def _haar_detect(self, frame) -> Tuple[float, float]:
        import cv2
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self._detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
        if len(faces) > 0:
            areas = [w * h for (x, y, w, h) in faces]
            idx = areas.index(max(areas))
            x, y, w, h = faces[idx]
            fh, fw = frame.shape[:2]
            cx = (x + w / 2) / fw
            cy = (y + h / 2) / fh
            return (cx, cy)
        return (0.5, 0.4)

    def detect_active_speaker_trajectory(self, video_path: str,
                                          start_time: float,
                                          end_time: float) -> Dict[str, Any]:
        """Legacy API — returns crop metadata."""
        faces = self.track_faces(video_path, start_time, end_time)
        avg_cx = sum(f[1] for f in faces) / len(faces)
        avg_cy = sum(f[2] for f in faces) / len(faces)

        try:
            import cv2
            cap = cv2.VideoCapture(video_path)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            cap.release()
        except Exception:
            width, height = 1920, 1080

        crop_width = int(height * (9 / 16))

        return {
            "focus_x": round(avg_cx, 4),
            "focus_y": round(avg_cy, 4),
            "frame_width": width,
            "frame_height": height,
            "aspect_ratio": "9:16",
            "crop_width": crop_width,
            "crop_height": height,
            "face_positions": [(round(t, 2), round(x, 4), round(y, 4)) for t, x, y in faces]
        }


face_tracker = FaceTrackerService()
