from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class User(BaseModel):
    name: str
    email: EmailStr
    password: str  # hashed in DB


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class QuestionAnswer(BaseModel):
    text: str
    options: List[str]
    answer: str
    userAnswer: Optional[str] = None


class TestResult(BaseModel):
    user_id: str
    title: str
    score: int
    total: int
    date: datetime = Field(default_factory=datetime.utcnow)
    questions: List[QuestionAnswer]
