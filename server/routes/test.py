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

# Auth
from utils.jwt_handler import decode_token

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class SectionalRequest(BaseModel):
    role: str
    subject: str
    num_questions: int

# Pydantic models matching the frontend payload
class QuestionAnswer(BaseModel):
    text: str
    options: List[str]
    answer: str
    userAnswer: Optional[str] = None

class TestResultSubmission(BaseModel):
    user_id: str
    title: str
    score: int
    total: int
    timeTaken: Optional[int] = None
    questions: List[QuestionAnswer]

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

# 1. Generate test from PDF
@router.post("/generate-test/")
async def generate_test(
    request: Request,
    file: UploadFile = File(...),
    num_questions: int = Form(...)
):
    try:
        # Step 1: Authenticate user via JWT
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(status_code=401, detail="Authorization header missing.")
        
        token = auth_header.replace("Bearer ", "")
        try:
            user = decode_token(token)
            user_id = user["user_id"]
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token.")

        # Step 2: Enforce free trial limit
        allowed, count = can_take_test(user_id, test_usage_collection)
        if not allowed:
            raise HTTPException(
                status_code=403,
                detail="Free trial limit (4 tests/week) reached. Please upgrade your plan."
            )

        # Step 3: Proceed with PDF check
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")

        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
        with open(file_path, "wb") as f:
            f.write(await file.read())

        content = extract_text_from_pdf(file_path)
        os.remove(file_path)

        if not content.strip():
            raise HTTPException(status_code=400, detail="No readable text found in the PDF.")

        # Step 4: Generate questions and parse using the robust function
        response_text = await generate_questions(content, num_questions)
        questions = parse_questions_robust(response_text)

        # Step 5: Update user's test usage
        test_usage_collection.update_one(
            {"user_id": user_id},
            {"$inc": {"tests_this_week": 1}}
        )

        return {
            "questions": questions,
            "free_tests_used": count + 1,
            "free_tests_remaining": max(0, 4 - (count + 1))
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Read PDF and return extracted text (No change needed, it's correct)
@router.post("/upload-and-read-pdf/")
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
@router.post("/generate_sectional/")
async def generate_sectional_test(data: SectionalRequest):
    try:
        response_text = await generate_sectional(data.role, data.subject, data.num_questions)
        # Use the same robust parsing function
        questions = parse_questions_robust(response_text)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Submit/save test result
@router.post("/submit-test")
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

@router.get("/history/{user_id}")
async def get_user_history(user_id: str, request: Request):
    try:
        db = request.app.database
        
        # Try ObjectId, fallback to string
        try:
            query_id = ObjectId(user_id)
        except bson_errors.InvalidId:
            query_id = user_id

        results_cursor = db.test_results.find({"user_id": query_id}).sort("date", -1)
        results = await results_cursor.to_list(length=100)

        formatted_results = []
        for r in results:
            formatted_results.append({
                "id": str(r["_id"]),
                "user_id": str(r["user_id"]),
                "title": r.get("title", "Untitled"),
                "score": r.get("score", 0),
                "total": r.get("total", 0),
                "date": r.get("date", datetime.utcnow()).isoformat(),
                "timeTaken": r.get("timeTaken"),
            })

        return {"tests": formatted_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test/{test_id}")
async def get_test_by_id(test_id: str, request: Request):
    try:
        db = request.app.database
        result = await db.test_results.find_one({"_id": ObjectId(test_id)})

        if not result:
            raise HTTPException(status_code=404, detail="Test not found")

        result["_id"] = str(result["_id"])
        result["user_id"] = str(result["user_id"])

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))