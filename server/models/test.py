from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class QuestionAnswer(BaseModel):
    text: str
    options: List[str]
    answer: str
    userAnswer: Optional[str] = None

class TestResultSubmission(BaseModel):
    user_id: str
    title: str
    score: int
    total: int
    date: datetime = Field(default_factory=datetime.utcnow)
    questions: List[QuestionAnswer]
