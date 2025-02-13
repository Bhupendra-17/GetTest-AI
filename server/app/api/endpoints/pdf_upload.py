from fastapi import APIRouter, File, UploadFile, HTTPException
import PyPDF2
import io

router = APIRouter(prefix="/pdf", tags=["PDF"])

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    try:
        # Read PDF content
        pdf_content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        
        # Extract text from PDF
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text()
        
        return {
            "filename": file.filename, 
            "page_count": len(pdf_reader.pages),
            "text_preview": text_content[:1000]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))