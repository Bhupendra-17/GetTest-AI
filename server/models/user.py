from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    gender: Optional[str] = "male"
    profilePic: Optional[str] = "https://cdn-icons-png.flaticon.com/512/236/236831.png"

class UserLogin(BaseModel):
    email: EmailStr
    password: str
