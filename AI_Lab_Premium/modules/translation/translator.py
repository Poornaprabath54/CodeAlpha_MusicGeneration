import requests
from config.config import Config


def translate_text(text: str, source_lang: str = 'AUTO', target_lang: str = 'EN-US') -> dict:
    text = (text or '').strip()
    if not text:
        return {'ok': False, 'error': 'Please enter text to translate.'}
    if not Config.TRANSLATION_API_KEY:
        return {'ok': False, 'error': 'Translation API key is missing. Add your DeepL key to the .env file.'}
    payload = {'text': [text], 'target_lang': target_lang}
    if source_lang and source_lang.upper() != 'AUTO':
        payload['source_lang'] = source_lang.upper()
    try:
        r = requests.post('https://api-free.deepl.com/v2/translate', params={'auth_key': Config.TRANSLATION_API_KEY}, json=payload, timeout=20)
        if r.status_code != 200:
            return {'ok': False, 'error': f'DeepL request failed ({r.status_code}). Check your API key and plan.'}
        data = r.json()
        result = data['translations'][0]
        return {'ok': True, 'translation': result['text'], 'detected_source': result.get('detected_source_language', source_lang)}
    except requests.RequestException as exc:
        return {'ok': False, 'error': f'Translation service unavailable: {exc}'}
