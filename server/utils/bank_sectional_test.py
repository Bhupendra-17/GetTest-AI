import os
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

async def generate_sectional(for_role: str, subject: str, num_questions: int):
    prompt = f"""Generate {num_questions} medium-hard level multiple-choice questions for candidates preparing for {for_role} examinations in India. Questions should be relevant to the subject below. Each question must have exactly four options (A, B, C, D) and clearly state the correct answer. Use this exact format:

1. [Question Text]
A) [Option A text]
B) [Option B text]
C) [Option C text]
D) [Option D text]
Answer: [Correct Letter, e.g., A]
Explanation: [Clear two-line explanation of why the answer is correct]

Role: {for_role}
Subject: {subject}

Generate all {num_questions} questions strictly following the format above. Do not deviate from this format."""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistralai/mistral-nemo",
        "messages": [
            {"role": "system", "content": "You are an expert question paper setter for competitive examinations in India. Always follow the exact output format given by the user."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 4000
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
