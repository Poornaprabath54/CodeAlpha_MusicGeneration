import os, requests
from services.translation_provider import TranslationProvider
class DeepLProvider(TranslationProvider):
    def __init__(self):
        self.api_key=os.getenv("DEEPL_API_KEY")
        self.base_url="https://api-free.deepl.com/v2" if self.api_key and self.api_key.endswith(":fx") else "https://api.deepl.com/v2"
    def _check_auth(self):
        if not self.api_key:
            raise ValueError("Translation API key is missing. Add your DeepL key to the .env file.")
    def translate_text(self,text,target_lang,source_lang=None):
        self._check_auth()
        data={"text":[text],"target_lang":target_lang.upper(),"preserve_formatting":"1"}
        if source_lang and source_lang.lower()!="auto": data["source_lang"]=source_lang.upper()
        r=requests.post(f"{self.base_url}/translate",headers={"Authorization":f"DeepL-Auth-Key {self.api_key}"},json=data,timeout=30)
        if r.status_code!=200: raise ValueError(f"DeepL API error ({r.status_code}). Check your API key and supported language.")
        x=r.json()["translations"][0]
        return {"translated_text":x["text"],"detected_source_language":x.get("detected_source_language",source_lang)}
    def get_supported_languages(self):
        self._check_auth()
        r=requests.get(f"{self.base_url}/languages?type=target",headers={"Authorization":f"DeepL-Auth-Key {self.api_key}"},timeout=30)
        if r.status_code!=200: raise ValueError(f"Unable to fetch languages from DeepL ({r.status_code}).")
        return [{"code":x["language"],"name":x["name"]} for x in r.json()]
