from abc import ABC, abstractmethod
class TranslationProvider(ABC):
    @abstractmethod
    def translate_text(self, text, target_lang, source_lang=None): pass
    @abstractmethod
    def get_supported_languages(self): pass
