from fastapi import APIRouter, HTTPException
from models import TestRequest
from utils.pdf_processor import extract_text_from_pdf
from utils.ai_generator import generate_questions

router = APIRouter()

@router.post("/generate")
async def generate_test(test_request: TestRequest):
    try:
        text_content = extract_text_from_pdf(test_request.pdf_url)
        if not text_content:
            raise HTTPException(status_code=400, detail="Failed to extract text from PDF")
        
        questions = generate_questions(text_content, test_request.num_questions)
        return {"questions": questions}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
