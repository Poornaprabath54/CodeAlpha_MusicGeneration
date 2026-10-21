import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "development-only-secret")
    TRANSLATION_API_KEY = os.getenv("TRANSLATION_API_KEY", "")
    UPLOAD_FOLDER = BASE_DIR / "uploads"
    MODEL_DIR = BASE_DIR / "models"
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024

    @classmethod
    def ensure_directories(cls):
        cls.UPLOAD_FOLDER.mkdir(exist_ok=True)
        cls.MODEL_DIR.mkdir(exist_ok=True)

Config.ensure_directories()
