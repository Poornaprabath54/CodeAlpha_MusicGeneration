import cv2
from ultralytics import YOLO

_model = None

def get_model():
    global _model
    if _model is None:
        _model = YOLO('yolo11n.pt')
    return _model

def generate_frames(source=0):
    model=get_model(); cap=cv2.VideoCapture(source)
    if not cap.isOpened(): raise RuntimeError('Could not open webcam/video source.')
    while True:
        ok, frame=cap.read()
        if not ok: break
        results=model.track(frame, persist=True, verbose=False)
        annotated=results[0].plot()
        ok, buffer=cv2.imencode('.jpg',annotated)
        if ok:
            yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n'+buffer.tobytes()+b'\r\n'
    cap.release()
