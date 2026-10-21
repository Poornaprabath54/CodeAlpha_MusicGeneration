from pathlib import Path
import cv2
from ultralytics import YOLO
from config.config import Config

MODEL_NAME = "yolo11n.pt"
MODEL_PATH = Path(Config.MODEL_DIR) / MODEL_NAME

_model = None

def get_model():
    global _model
    if _model is None:
        _model = YOLO(str(MODEL_PATH))
    return _model

def generate_frames(source=0):
    model = get_model()
    capture = cv2.VideoCapture(source)
    if not capture.isOpened():
        raise RuntimeError("Could not open the selected webcam/video source.")

    try:
        while True:
            ok, frame = capture.read()
            if not ok:
                break

            results = model.track(frame, persist=True, verbose=False, conf=0.35)
            annotated = results[0].plot()

            ret, buffer = cv2.imencode(".jpg", annotated)
            if not ret:
                continue

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + buffer.tobytes()
                + b"\r\n"
            )
    finally:
        capture.release()
