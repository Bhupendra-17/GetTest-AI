from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
import os
import uuid

# Utils
from utils.pdf_processor import extract_text_from_pdf
from utils.ai_generator import generate_questions
from utils.bank_sectional_test import generate_sectional
from utils.test_tracker import can_take_test, get_start_of_week

# Models and Database
from models.test import TestResult
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

# Utility function to parse questions
def parse_questions(text: str):
    questions = []
    current = {}
    for line in text.strip().split("\n"):
        line = line.strip()
        if line and line[0].isdigit() and "." in line:
            if current:
                questions.append(current)
                current = {}
            current["text"] = line
            current["options"] = []
        elif line.startswith(("A)", "B)", "C)", "D)")):
            current.setdefault("options", []).append(line)
        elif line.lower().startswith("answer:"):
            current["answer"] = line.split(":", 1)[1].strip()
    if current:
        questions.append(current)
    return questions

#1. Generate test
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

        # Step 4: Generate questions
        response_text = await generate_questions(content, num_questions)
        questions = parse_questions(response_text)

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

# 2. Read PDF and return extracted text
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

# 3. Generate test without PDF (sectional test)
@router.post("/generate_sectional/")
async def generate_sectional_test(data: SectionalRequest):
    try:
        response_text = await generate_sectional(data.role, data.subject, data.num_questions)
        questions = parse_questions(response_text)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Submit/save test result
@router.post("/submit-test")
async def submit_test(request: Request, result: TestResult):
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
        # Find results for user and sort by most recent
        results_cursor = db.test_results.find({"user_id": ObjectId(user_id)}).sort("date", -1)
        results = await results_cursor.to_list(length=100)

        # Format each test result
        formatted_results = []
        for r in results:
            formatted_results.append({
                "id": str(r["_id"]),
                "user_id": str(r["user_id"]),
                "title": r.get("title", "Untitled"),
                "score": r.get("score", 0),
                "total": r.get("total", 0),
                "date": r.get("date", datetime.utcnow()).isoformat(),
                "timeTaken": r.get("timeTaken", None),  # optional field
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
