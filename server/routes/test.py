from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from bson import ObjectId, errors as bson_errors
import os
import uuid
import re
from typing import List, Optional

# Utils
from utils.pdf_processor import extract_text_from_pdf
from utils.ai_generator import generate_questions
from utils.bank_sectional_test import generate_sectional
from utils.test_tracker import can_take_test
# Models and Database
from config import db  # ✅ import your connected DB
test_usage_collection = db.test_usages

from models.test import TestResultSubmission
from models.sectional import SectionalRequest

# Auth
from utils.jwt_handler import decode_token

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Utility function to parse questions (now more robust with regex)
def parse_questions_robust(text: str):
    """
    Parses a block of text containing questions, options, and answers using regular expressions.
    This is more robust to slight formatting variations from the AI.
    """
    questions = []
    # Using regex to split the text into question blocks based on a number followed by a dot.
    # The lookahead `(?=\n\s*\d+\.\s)` keeps the delimiter in the result, which is crucial for processing.
    question_blocks = re.split(r'(?=\n\s*\d+\.\s)', text.strip())

    for block in question_blocks:
        if not block.strip():
            continue

        # Regex to find the question number and text
        q_match = re.search(r'^\s*(\d+)\.\s*(.*?)(?=\n\s*(?:[A-D]\)|\s*Answer:|$))', block, re.DOTALL)
        
        # Regex to find all options
        options_matches = re.findall(r'([A-D])\)\s*(.*?)(?=\n\s*(?:[B-D]\)|Answer:|$))', block, re.DOTALL)

        # Regex to find the answer
        answer_match = re.search(r'Answer:\s*([A-D])', block, re.IGNORECASE)

        if q_match and answer_match:
            question_data = {
                "text": q_match.group(2).strip(),
                "options": [f"{key}) {text.strip()}" for key, text in options_matches],
                "answer": answer_match.group(1).upper()
            }
            questions.append(question_data)

    return questions

@router.post("/generate_test/", tags=["Test"])
async def generate_test(file: UploadFile = File(...), num_questions: int = Form(...)):
    try:
        # Save uploaded file with unique name
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")

        # Write uploaded file
        with open(file_path, "wb") as f:
            f.write(await file.read())

        print(f"✅ Received file: {file.filename}, saved as {file_path}")
        print(f"✅ Generating {num_questions} questions")

        # Extract text from PDF
        content = extract_text_from_pdf(file_path)
        os.remove(file_path)

        if not content.strip():
            raise HTTPException(status_code=400, detail="No readable text found in the PDF.")

        # Generate questions with AI
        response_text = await generate_questions(content, num_questions)

        # Parse response into structured format
        questions = []
        current = {}

        for line in response_text.strip().split("\n"):
            line = line.strip()
            if not line:
                continue
            if re.match(r"^\d+\.", line):  # New question line
                if current:
                    questions.append(current)
                current = {"text": line, "options": []}
            elif re.match(r"^[A-D]\)", line):  # Option line
                current.setdefault("options", []).append(line)
            elif line.lower().startswith("answer:"):
                current["answer"] = line.split(":")[-1].strip()

        if current:
            questions.append(current)

        print(f"✅ Generated {len(questions)} questions successfully.")
        return {"questions": questions}

    except Exception as e:
        print("❌ Error generating test:", str(e))
        raise HTTPException(status_code=500, detail=f"Error generating test: {str(e)}")

# 2. Read PDF and return extracted text (No change needed, it's correct)
@router.post("/upload-and-read-pdf/", tags=["Test"])
async def upload_and_read_pdf(file: UploadFile = File(...)):
    try:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
        temp_filename = f"temp_{uuid.uuid4()}.pdf"
        with open(temp_filename, "wb") as f:
            f.write(await file.read())

        extracted_text = extract_text_from_pdf(temp_filename)
        os.remove(temp_filename)

        return {"extracted_text": extracted_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")

# 3. Generate sectional test
@router.post("/generate_sectional/", tags=["Test"])
async def generate_sectional_test(data: SectionalRequest):
    try:
        response_text = await generate_sectional(data.role, data.subject, data.num_questions)
        # Use the same robust parsing function
        questions = parse_questions_robust(response_text)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Submit/save test result
@router.post("/submit-test", tags=["Test"])
async def submit_test(request: Request, result: TestResultSubmission):
    try:
        db = request.app.database
        result_dict = result.dict()
        result_dict["user_id"] = ObjectId(result_dict["user_id"])
        insert_result = await db.test_results.insert_one(result_dict)

        if insert_result.inserted_id:
            return {"message": "Test result saved", "id": str(insert_result.inserted_id)}
        else:
            raise HTTPException(status_code=500, detail="Failed to save result")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
