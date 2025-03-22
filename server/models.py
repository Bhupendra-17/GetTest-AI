from pydantic import BaseModel, EmailStr
from typing import Optional

# User Model
class User(BaseModel):
    email: EmailStr
    password: str

# Test Request Model
class TestRequest(BaseModel):
    pdf_url: str
    num_questions: Optional[int] = 10
