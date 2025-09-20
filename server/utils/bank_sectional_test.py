import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

async def generate_sectional(for_role:str, subject: str, num_questions: int):
    prompt = f"""
    Generate {num_questions} medium-hard level multiple-choice questions from the text that have questions which are asked in previous years of {for_role}. Questions should be related for the candidates. Each question must have exactly four options (A, B, C, D) and an answer in this format:

    1. [Question Text]
    A) [Option A text]
    B) [Option B text]
    C) [Option C text]
    D) [Option D text]
    Answer: [Correct Letter, e.g., A]

    For Role of:
    {for_role}
    Subject:
    {subject}

    Have an explanation for each of the answers in two lines but clear.
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
