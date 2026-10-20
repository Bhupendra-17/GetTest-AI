from pydantic import BaseModel, EmailStr
from typing import Optional


class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    gender: Optional[str] = None
    profilePic: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str

