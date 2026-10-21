import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class FAQChatbot:
    def __init__(self, threshold: float = 0.20):
        self.threshold = threshold
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.questions = []
        self.answers = []
        self.matrix = None
        self._load_data()

    def _load_data(self):
        path = Path(__file__).with_name("faq_data.json")
        with path.open("r", encoding="utf-8") as file:
            data = json.load(file)
        self.questions = [item["question"] for item in data]
        self.answers = [item["answer"] for item in data]
        self.matrix = self.vectorizer.fit_transform(self.questions)

    def get_response(self, query: str) -> dict:
        query = (query or "").strip()
        if not query:
            return {"response": "Please ask a question.", "score": 0.0}

        vector = self.vectorizer.transform([query])
        scores = cosine_similarity(vector, self.matrix)[0]
        index = int(scores.argmax())
        score = float(scores[index])

        if score >= self.threshold:
            return {"response": self.answers[index], "score": round(score, 3)}
        return {
            "response": "I couldn't find a reliable answer. Try asking about AI, machine learning, Python, NLP, computer vision, APIs, GitHub, YOLO, or OpenCV.",
            "score": round(score, 3),
        }
