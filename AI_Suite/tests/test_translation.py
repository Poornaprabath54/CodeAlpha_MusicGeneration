from modules.translation.translator import translate_text

def test_empty_text():
    result = translate_text("", "AUTO", "EN-US")
    assert "empty" in result["error"].lower()

def test_missing_key(monkeypatch):
    from config.config import Config
    monkeypatch.setattr(Config, "TRANSLATION_API_KEY", "")
    result = translate_text("Hello", "AUTO", "EN-US")
    assert "api key" in result["error"].lower()
