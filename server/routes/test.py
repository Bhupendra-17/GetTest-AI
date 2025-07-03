from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from utils.pdf_processor import extract_text_from_pdf
from utils.ai_generator import generate_questions
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/generate-test/")
async def generate_test(file: UploadFile = File(...), num_questions: int = Form(...)):
    try:
        # Save uploaded file with a unique name
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")

        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Extract text from PDF
        content = extract_text_from_pdf(file_path)

        # Delete file after use
        os.remove(file_path)

        if not content.strip():
            raise HTTPException(status_code=400, detail="No readable text found in the PDF.")

        # Generate questions from content
        response_text = await generate_questions(content, num_questions)

        # Parse the generated text into structured questions
        questions = []
        current = {}
        for line in response_text.strip().split("\n"):
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
                current["answer"] = line.split(":")[1].strip()

        if current:
            questions.append(current)

        return {"questions": questions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-and-read-pdf/")
async def upload_and_read_pdf(file: UploadFile = File(...)):
    try:
        # Save file temporarily
        file_ext = file.filename.split(".")[-1]
        if file_ext.lower() != "pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
        temp_filename = f"temp_{uuid.uuid4()}.pdf"
        with open(temp_filename, "wb") as f:
            f.write(await file.read())
        
        # Extract text from PDF
        extracted_text = extract_text_from_pdf(temp_filename)

        # Delete temp file
        os.remove(temp_filename)

        return {"extracted_text": extracted_text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")