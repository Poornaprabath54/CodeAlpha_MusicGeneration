import requests

api_url = 'https://api-free.deepl.com/v2/translate'
api_key = 'a01bb1cd-4bb7-4ae0-80c8-0a8151ce3160:fx'
type_param = 'target'
url = f"{api_url.replace('/translate', '')}/languages?type={type_param}"

headers = {
    'Authorization': f'DeepL-Auth-Key {api_key}',
    'Content-Type': 'application/json'
}

try:
    response = requests.get(url, headers=headers, timeout=10)
    print(response.status_code)
    response.raise_for_status()
    print(len(response.json()))
except Exception as e:
    print(f"Error fetching languages: {e}")
    print(response.text if 'response' in locals() else 'no response')
