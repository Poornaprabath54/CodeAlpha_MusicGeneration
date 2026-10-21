# CodeAlpha AI Suite

A GitHub-ready local AI dashboard created for the CodeAlpha Artificial Intelligence Internship. It combines three tasks:

1. Language Translation Tool
2. FAQ Chatbot
3. Object Detection and Tracking

## Technology

- Python
- Flask
- HTML/CSS/JavaScript
- DeepL Translation API
- scikit-learn TF-IDF + cosine similarity
- OpenCV
- Ultralytics YOLO tracking
- pytest

## Run in Visual Studio Code on Windows

### 1. Open the folder

Open `CodeAlpha_AI_Suite` in VS Code.

### 2. Open Terminal

Use **Terminal → New Terminal**.

### 3. Create a virtual environment

```cmd
python -m venv venv
```

### 4. Activate it

```cmd
venv\Scripts\activate
```

If PowerShell blocks activation, either use the VS Code Command Prompt terminal or run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 5. Install dependencies

```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 6. Configure the environment

```cmd
copy .env.example .env
```

Open `.env` and add your DeepL API key.

### 7. Run

```cmd
python app.py
```

Open the address printed by Flask, normally:

`http://127.0.0.1:5000`

## First YOLO run

The first object-detection run may download the selected pretrained YOLO model automatically. Internet access is required for that initial model download.

The model is kept in the project's `models` directory and is ignored by Git because model files can be large.

## Modules

### Task 1 — Language Translation

Enter text, select source and target languages, and translate using the DeepL API.

### Task 2 — FAQ Chatbot

The chatbot uses TF-IDF vectors and cosine similarity to select the closest FAQ answer.

### Task 4 — Object Detection and Tracking

The detection page supports the local webcam and uploaded video. YOLO detects objects and maintains tracking IDs across frames.

## Testing

With the virtual environment activated:

```cmd
pytest -q
```

## GitHub

Do not commit `.env`, `venv`, cache folders, uploads, outputs, or model weights.

```cmd
git init
git add .
git commit -m "Initial CodeAlpha AI Suite project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## ZIP submission

Before creating the ZIP:

1. Stop Flask with `Ctrl+C`.
2. Make sure `.env` is removed or excluded.
3. Make sure `venv` is excluded.
4. Make sure temporary files are removed.
5. Right-click the `CodeAlpha_AI_Suite` folder.
6. Choose **Send to → Compressed (zipped) folder**.
7. Name it `CodeAlpha_AI_Suite.zip`.

The ZIP should contain the source code, README, requirements, configuration example, templates, static files, modules, and tests. It should not contain your secrets or virtual environment.

## Demo sequence

1. Open the dashboard.
2. Demonstrate translation.
3. Demonstrate three or four chatbot questions.
4. Start the webcam and show YOLO detections/tracking IDs.
5. Optionally upload a short video.
6. Show the GitHub repository.
7. Explain that the project contains three CodeAlpha AI tasks in one application.

## Important

The application must be tested locally before submission. API credentials, webcam permissions, package installation, and model downloading depend on the local computer environment.
