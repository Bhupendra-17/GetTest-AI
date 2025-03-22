import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_questions(text: str, num_questions: int = 10):
    prompt = f"Generate {num_questions} multiple-choice questions from the following text:\n\n{text}"

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": prompt}],
        max_tokens=500
    )

    return response["choices"][0]["message"]["content"]
