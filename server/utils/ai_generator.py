import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

async def generate_questions(content: str, num_questions: int):
    prompt = f"""
    Generate exactly {num_questions} medium-hard level multiple-choice questions from the text that have subject necessary information and should be useful for the candidate exams. Each question must have 4 options (A–D) and an answer in this format:

    Question?
    A) ...
    B) ...
    C) ...
    D) ...
    Answer: A

    Content:
    {content}
    """

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]
