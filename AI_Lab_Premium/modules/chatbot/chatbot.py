import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from modules.coding.coding_assistant import CodingAssistant

FAQS = [
    ('what is artificial intelligence', 'Artificial Intelligence is the field of building systems that perform tasks that normally require human intelligence, such as reasoning, perception and language understanding.'),
    ('what is machine learning', 'Machine learning is a branch of AI where systems learn patterns from data to make predictions or decisions.'),
    ('what is deep learning', 'Deep learning uses multi-layer neural networks to learn increasingly complex representations from data.'),
    ('what is python', 'Python is a high-level programming language known for readability and a large ecosystem for web, data, automation and AI.'),
    ('what is flask', 'Flask is a lightweight Python web framework used to build web applications and APIs.'),
    ('what is computer vision', 'Computer vision enables software to interpret images and video. This project uses OpenCV and YOLO for object detection.'),
    ('what is nlp', 'Natural Language Processing enables computers to process, classify, search and generate human language.'),
    ('what is codealpha', 'CodeAlpha is an internship and project platform. This suite demonstrates AI-focused tasks in one integrated application.'),
]

class FAQChatbot:
    def __init__(self):
        self.questions = [q for q, _ in FAQS]
        self.answers = [a for _, a in FAQS]
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
        self.matrix = self.vectorizer.fit_transform(self.questions)
        self.coder = CodingAssistant()

    def get_response(self, message: str) -> dict:
        message = (message or '').strip()
        if not message:
            return {'ok': False, 'error': 'Please enter a message.'}
        if self.coder.looks_like_code_request(message):
            result = self.coder.generate(message)
            return {'ok': True, 'type': 'code', **result}
        vec = self.vectorizer.transform([message])
        scores = cosine_similarity(vec, self.matrix)[0]
        idx = int(scores.argmax())
        confidence = float(scores[idx])
        if confidence < 0.20:
            return {'ok': True, 'type': 'chat', 'answer': "I can help with programming, AI, translation, computer vision, music generation, and the CodeAlpha project. Try asking me to write a program in a specific language.", 'confidence': confidence}
        return {'ok': True, 'type': 'chat', 'answer': self.answers[idx], 'confidence': confidence}
