from fastapi import APIRouter, HTTPException, Depends, Request, status
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

    # ✅ Ensure unique email before inserting
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )

    # ✅ Hash password securely
    hashed_password = pwd_context.hash(user.password)

    # Convert to dict and store hashed password
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()  # optional but useful
    user_dict["updated_at"] = datetime.utcnow()

    # ✅ Insert user into DB
    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)

    # ✅ Generate JWT token
    token = create_access_token({"sub": user.email, "user_id": user_id})

    # ✅ Return consistent user info
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "_id": user_id,
            "name": user.name,
            "email": user.email,
            "gender": user.gender,
            "profilePic": user.profilePic,
        },
    }


@router.post("/login")
async def login_user(user: UserLogin, request: Request):
    db = request.app.database

    # ✅ Find user by email
    db_user = await db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # ✅ Verify password
    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # ✅ Generate JWT token
    token = create_access_token({"sub": db_user["email"], "user_id": str(db_user["_id"])})

    # ✅ Return user info
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "_id": str(db_user["_id"]),
            "name": db_user.get("name", ""),
            "email": db_user["email"],
            "gender": db_user.get("gender", "male"),
            "profilePic": db_user.get("profilePic", "https://cdn-icons-png.flaticon.com/512/236/236831.png"),
        },
    }
