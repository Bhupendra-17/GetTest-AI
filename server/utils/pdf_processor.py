import PyPDF2
import requests
from io import BytesIO

def extract_text_from_pdf(pdf_url: str) -> str:
    try:
        response = requests.get(pdf_url)
        response.raise_for_status()  # Raise error if download fails

        pdf_file = BytesIO(response.content)
        reader = PyPDF2.PdfReader(pdf_file)
        
        text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
        return text.strip()
    
    except Exception as e:
        return f"Error extracting text: {str(e)}"
