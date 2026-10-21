import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

class Config:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'change-me-in-production')
    TRANSLATION_API_KEY = os.getenv('TRANSLATION_API_KEY', '')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')
    UPLOAD_FOLDER = BASE_DIR / 'uploads'
    GENERATED_MUSIC_FOLDER = BASE_DIR / 'generated_music'
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024

Config.UPLOAD_FOLDER.mkdir(exist_ok=True)
Config.GENERATED_MUSIC_FOLDER.mkdir(exist_ok=True)
