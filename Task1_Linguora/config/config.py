import os
class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-only-secret")
    DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
