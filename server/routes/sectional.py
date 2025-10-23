from fastapi import APIRouter, HTTPException
from models.test import SectionalRequest
from utils.bank_sectional_test import generate_sectional
from utils.parsers import parse_questions_robust

router = APIRouter()

@router.post("/generate_sectional/")
async def generate_sectional_test(data: SectionalRequest):
    try:
        response_text = await generate_sectional(data.role, data.subject, data.num_questions)
        questions = parse_questions_robust(response_text)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
