def validate_translation_request(data):
    if not data:
        return False, "Invalid JSON payload."
    text = str(data.get("text", "")).strip()
    if not text:
        return False, "Enter some text to translate."
    if len(text) > 5000:
        return False, "Text exceeds the 5000 character limit."
    if not data.get("target"):
        return False, "Target language is required."
    return True, ""
