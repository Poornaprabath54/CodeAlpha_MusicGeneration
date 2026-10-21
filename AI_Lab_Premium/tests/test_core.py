from modules.coding.coding_assistant import CodingAssistant
from modules.music.music_generator import generate_music

def test_coding_language_detection():
    c=CodingAssistant(); assert c.detect_language('write a Java program')=='java'; assert c.looks_like_code_request('create a Python program')

def test_music_generation(tmp_path, monkeypatch):
    from config import config
    monkeypatch.setattr(config.Config, 'GENERATED_MUSIC_FOLDER', tmp_path)
    result=generate_music('Telugu','Epic',96,10,'test')
    assert result['ok'] is True
    assert (tmp_path / result['file'].split('/')[-1]).exists()
