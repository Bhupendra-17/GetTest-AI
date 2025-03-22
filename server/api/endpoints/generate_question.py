from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
import openai

router = APIRouter()

@router.post("/generate-questions/")
async def generate_questions(file: UploadFile):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    # Extract text from PDF
    pdf_reader = PdfReader(file.file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()

    # Generate questions using OpenAI
    prompt = (
        "Generate 5 multiple-choice questions with 4 options each from the following text:\n\n"
        f"{text}\n\n"
        "Provide the correct answer for each question."
    )
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500
    )

    questions = response.choices[0].message['content'].strip()
    return JSONResponse(content={"questions": questions})
