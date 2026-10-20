import re

def parse_questions_robust(text: str):
    """
    Parses a block of text containing questions, options (A-D), answers and optional explanations.
    """
    questions = []

    # Split on question number boundaries (e.g. "1." "2." etc.)
    question_blocks = re.split(r'\n(?=\s*\d+\.\s)', text.strip())

    for block in question_blocks:
        block = block.strip()
        if not block:
            continue

        # Extract question text
        q_match = re.search(
            r'^\s*\d+\.\s*(.*?)(?=\n\s*[A-D]\))',
            block, re.DOTALL
        )

        # Extract all options A-D
        options_matches = re.findall(
            r'([A-D])\)\s*(.*?)(?=\n\s*(?:[A-D]\)|Answer:|Explanation:|$))',
            block, re.DOTALL
        )

        # Extract the correct answer letter
        answer_match = re.search(r'Answer:\s*([A-D])', block, re.IGNORECASE)

        # Extract explanation if present
        explanation_match = re.search(r'Explanation:\s*(.*?)(?=\n\s*\d+\.|$)', block, re.DOTALL | re.IGNORECASE)

        if q_match and answer_match and len(options_matches) >= 2:
            question_data = {
                "text": q_match.group(1).strip(),
                "options": [f"{key}) {opt.strip()}" for key, opt in options_matches],
                "answer": answer_match.group(1).upper(),
                "explanation": explanation_match.group(1).strip() if explanation_match else ""
            }
            questions.append(question_data)

    return questions
