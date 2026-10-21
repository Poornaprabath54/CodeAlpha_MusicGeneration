from services.deepl_provider import DeepLProvider
from utils.language_registry import enrich_language_data, LANGUAGE_METADATA
class LanguageService:
    def __init__(self):
        self.provider=DeepLProvider()
        self._cached=None
    def get_supported_languages(self):
        if self._cached is None:
            try: self._cached=enrich_language_data(self.provider.get_supported_languages())
            except ValueError:
                self._cached=enrich_language_data([{"code":k,"name":v["name"]} for k,v in LANGUAGE_METADATA.items()])
        return self._cached
    def translate(self,text,target_lang,source_lang=None):
        return self.provider.translate_text(text,target_lang,source_lang)
