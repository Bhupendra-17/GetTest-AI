from pydantic import BaseModel
from typing import List, Optional

class QuestionAnswer(BaseModel):
    text: str
    options: List[str]
    answer: str
    userAnswer: Optional[str] = None
