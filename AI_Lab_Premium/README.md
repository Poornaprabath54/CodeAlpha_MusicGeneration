# CodeAlpha AI Lab — Premium

A polished local AI creative studio combining CodeAlpha-oriented AI tasks into one application:

- **AI Programming Assistant** — code generation across 20+ popular languages, with optional Gemini API integration.
- **Global AI Music Studio** — generates original audio compositions inspired by broad regional styles, including Telugu, Tamil, Hindi, Indian Classical, Japanese, Korean, African, Latin and cinematic styles.
- **Translation Studio** — DeepL API integration with safe `.env` configuration.
- **Vision Lab** — YOLO object detection and tracking.
- **Premium dashboard** — glassmorphism, animated ambient background, responsive layout and real-time audio visualizer.

## Copyright / music safety

The music module generates **original compositions**. It does not download or redistribute copyrighted commercial recordings. Users can extend the project with legal APIs or their own licensed audio if desired.

## Windows + VS Code

Open this folder in VS Code.

```cmd
py -m venv venv
venv\Scripts\activate.bat
py -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
python app.py
```

Open `http://127.0.0.1:5000`.

If PowerShell blocks `venv\Scripts\activate`, use the VS Code **Command Prompt** terminal and run `venv\Scripts\activate.bat`.

## API configuration

Open `.env` and set:

```env
TRANSLATION_API_KEY=your_new_deepl_key
GEMINI_API_KEY=optional_gemini_key
GEMINI_MODEL=gemini-2.5-flash
FLASK_SECRET_KEY=your_random_secret
```

Never commit `.env` or share API keys.

## Features

### AI Programming Assistant

Recognizes requests mentioning programming languages and common coding tasks. Without an API key it uses safe local templates; with `GEMINI_API_KEY` it can use Gemini for richer natural-language code generation.

Supported language families include Python, C, C++, Java, JavaScript, TypeScript, HTML, CSS, SQL, C#, Go, Rust, Kotlin, Swift, PHP, Ruby, Dart, R, MATLAB, Bash, PowerShell, Scala and Perl.

### Music Studio

The local generator creates original WAV compositions from deterministic musical patterns. The browser's Web Audio API analyzes the actual generated audio and renders a live spectrum visualizer while playback runs.

### Vision Lab

The first YOLO run may download the selected model. Internet access is required for the model download.

## Testing

```cmd
pytest -q
```

## GitHub

```cmd
git init
git add .
git commit -m "Build CodeAlpha AI Lab Premium"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

The `.gitignore` protects `.env`, virtual environments, uploads, generated audio and model weights.
