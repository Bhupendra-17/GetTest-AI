from fastapi import APIRouter, HTTPException, Depends, Request
from models.user import User, UserLogin
from passlib.context import CryptContext
from utils.jwt_handler import create_access_token
from bson import ObjectId
from datetime import datetime

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
async def register_user(user: User, request: Request):
    db = request.app.database
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password

    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)

    token = create_access_token({"sub": user.email, "user_id": user_id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "_id": user_id,
            "name": user.name,
            "email": user.email,
            "gender": user.gender,
            "profilePic": user.profilePic
        }
    }


@router.post("/login")
async def login_user(user: UserLogin, request: Request):
    db = request.app.database
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email, "user_id": str(db_user["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "_id": str(db_user["_id"]),
            "name": db_user.get("name", ""),
            "email": db_user["email"],
            "gender": db_user.get("gender", "male"),
            "profilePic": db_user.get("profilePic", "")
        }
    }