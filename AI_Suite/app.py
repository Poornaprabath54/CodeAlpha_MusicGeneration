from pathlib import Path
from flask import Flask, Response, jsonify, render_template, request
from werkzeug.utils import secure_filename

from config.config import Config
from modules.translation.translator import translate_text
from modules.chatbot.chatbot import FAQChatbot
from modules.detection.detector import generate_frames

app = Flask(__name__)
app.config.from_object(Config)
app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH

chatbot = FAQChatbot()
ALLOWED_VIDEO_EXTENSIONS = {"mp4", "avi", "mov", "mkv", "webm"}

@app.get("/")
def index():
    return render_template("index.html")

@app.get("/translation")
def translation_page():
    return render_template("translation.html")

@app.get("/chatbot")
def chatbot_page():
    return render_template("chatbot.html")

@app.get("/detection")
def detection_page():
    return render_template("detection.html")

@app.post("/api/translate")
def api_translate():
    data = request.get_json(silent=True) or {}
    return jsonify(translate_text(
        data.get("text", ""),
        data.get("source_lang", "AUTO"),
        data.get("target_lang", "EN-US"),
    ))

@app.post("/api/chat")
def api_chat():
    data = request.get_json(silent=True) or {}
    return jsonify(chatbot.get_response(data.get("message", "")))

@app.get("/video_feed")
def video_feed():
    try:
        return Response(generate_frames(0), mimetype="multipart/x-mixed-replace; boundary=frame")
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@app.post("/api/upload-video")
def upload_video():
    file = request.files.get("video")
    if not file or not file.filename:
        return jsonify({"error": "Please choose a video file."}), 400

    extension = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if extension not in ALLOWED_VIDEO_EXTENSIONS:
        return jsonify({"error": "Unsupported video format."}), 400

    filename = secure_filename(file.filename)
    path = Path(Config.UPLOAD_FOLDER) / filename
    file.save(path)
    return jsonify({"video_url": f"/uploaded_video/{filename}"})

@app.get("/uploaded_video/<filename>")
def uploaded_video(filename):
    path = Path(Config.UPLOAD_FOLDER) / secure_filename(filename)
    if not path.exists():
        return jsonify({"error": "Video not found."}), 404
    try:
        return Response(generate_frames(str(path)), mimetype="multipart/x-mixed-replace; boundary=frame")
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@app.errorhandler(413)
def too_large(_error):
    return jsonify({"error": "Uploaded file is too large. Maximum size is 200 MB."}), 413

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
