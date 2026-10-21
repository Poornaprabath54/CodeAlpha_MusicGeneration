import requests
from config.config import Config

DEEPL_URL = "https://api-free.deepl.com/v2/translate"

def translate_text(text: str, source_lang: str, target_lang: str) -> dict:
    text = (text or "").strip()
    if not text:
        return {"error": "Input text cannot be empty."}

    api_key = Config.TRANSLATION_API_KEY.strip()
    if not api_key or api_key == "your_deepl_api_key_here":
        return {"error": "Translation API key is missing. Add your DeepL key to the .env file."}

    if not target_lang:
        return {"error": "Please select a target language."}

    payload = {"text": [text], "target_lang": target_lang}
    if source_lang and source_lang != "AUTO":
        payload["source_lang"] = source_lang

    headers = {
        "Authorization": f"DeepL-Auth-Key {api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(DEEPL_URL, json=payload, headers=headers, timeout=20)
        if response.status_code == 403:
            return {"error": "Invalid or unauthorized DeepL API key."}
        response.raise_for_status()
        data = response.json()
        return {"translated_text": data["translations"][0]["text"]}
    except requests.RequestException as exc:
        return {"error": f"Translation service error: {exc}"}
    except (KeyError, IndexError, ValueError):
        return {"error": "The translation service returned an unexpected response."}
