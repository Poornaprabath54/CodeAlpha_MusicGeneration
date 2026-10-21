from modules.chatbot.chatbot import FAQChatbot

def test_known_question():
    bot = FAQChatbot()
    result = bot.get_response("What is machine learning?")
    assert result["response"]
    assert result["score"] > 0

def test_empty_question():
    bot = FAQChatbot()
    assert "valid question" in bot.get_response("")["response"].lower()
