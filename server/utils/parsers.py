import re

def parse_questions_robust(text: str):
    """
    Parses a block of text containing questions, options, and answers using regex.
    """
    questions = []
    question_blocks = re.split(r'(?=\n\s*\d+\.\s)', text.strip())

    for block in question_blocks:
        if not block.strip():
            continue

        q_match = re.search(
            r'^\s*(\d+)\.\s*(.*?)(?=\n\s*(?:[A-D]\)|\s*Answer:|$))',
            block, re.DOTALL
        )
        options_matches = re.findall(
            r'([A-D])\)\s*(.*?)(?=\n\s*(?:[B-D]\)|Answer:|$))',
            block, re.DOTALL
        )
        answer_match = re.search(r'Answer:\s*([A-D])', block, re.IGNORECASE)

        if q_match and answer_match:
            question_data = {
                "text": q_match.group(2).strip(),
                "options": [f"{key}) {text.strip()}" for key, text in options_matches],
                "answer": answer_match.group(1).upper()
            }
            questions.append(question_data)

    return questions
