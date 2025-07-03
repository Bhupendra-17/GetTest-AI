from fastapi import APIRouter, HTTPException, Depends
from models import User, UserLogin
from passlib.context import CryptContext
from utils.jwt_handler import create_access_token
from fastapi import Request

router= APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

@router.post("/register")
async def register_user(user: User, request: Request):
    db = request.app.database
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password

    await db.users.insert_one(user_dict)

    # ✅ Create JWT token after registration
    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user.name,
            "email": user.email
        }
    }

@router.post("/login")
async def login_user(user: UserLogin, request: Request):
    db = request.app.database
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": db_user.get("name", ""),
            "email": db_user["email"]
        }
    }
