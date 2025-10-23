from fastapi import APIRouter, UploadFile, File, HTTPException
import os, uuid
from utils.pdf_processor import extract_text_from_pdf

router = APIRouter()


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
