from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TestUsage(BaseModel):
    user_id: str
    tests_this_week: int
    week_start: datetime
