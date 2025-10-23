from pydantic import BaseModel

class SectionalRequest(BaseModel):
    role: str
    subject: str
    num_questions: int
