import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config.config import Config
from services.language_service import LanguageService
from utils.validation import validate_translation_request
from utils.security import setup_security

load_dotenv()
app = Flask(__name__)
app.config.from_object(Config)
setup_security(app)
limiter = Limiter(key_func=get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])
language_service = LanguageService()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/languages")
@limiter.exempt
def languages():
    try:
        return jsonify({"success": True, "languages": language_service.get_supported_languages()})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/translate", methods=["POST"])
@limiter.limit("20 per minute")
def translate():
    data = request.get_json(silent=True)
    ok, error = validate_translation_request(data)
    if not ok:
        return jsonify({"success": False, "error": error}), 400
    try:
        result = language_service.translate(data["text"], data["target"], data.get("source"))
        return jsonify({"success": True, "result": result})
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception:
        app.logger.exception("Translation error")
        return jsonify({"success": False, "error": "Translation service is temporarily unavailable."}), 502

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True, port=5000)
