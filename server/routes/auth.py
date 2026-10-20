from fastapi import APIRouter, HTTPException, Request, Header, status
from models.user import User, UserLogin
from utils.jwt_handler import create_access_token, decode_token
from bson import ObjectId
from datetime import datetime
import bcrypt
import pymongo.errors
from typing import Optional

router = APIRouter()


def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if not plain_password or not hashed_password:
            return False
        pwd_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except Exception:
        return False


def build_user_response(user_id: str, doc: dict) -> dict:
    name = doc.get("name", "").strip()
    email = doc.get("email", "").strip().lower()
    default_pic = f"https://ui-avatars.com/api/?name={name or 'User'}&background=fed7aa&color=c2410c&bold=true"
    return {
        "_id": str(user_id),
        "name": name,
        "email": email,
        "gender": doc.get("gender") or "unspecified",
        "profilePic": doc.get("profilePic") or default_pic,
    }


async def handle_register(user: User, request: Request):
    db = request.app.database
    email = user.email.strip().lower()
    name = user.name.strip()

    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name is required."
        )

    if not user.password or len(user.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters."
        )

    try:
        existing = await db.users.find_one({"email": email})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered. Please sign in."
            )

        hashed_password = hash_password(user.password)

        # Keep DB document simple and clean: only core essential fields
        user_doc = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }

        # Keep optional profile data only if explicitly provided
        if user.gender:
            user_doc["gender"] = user.gender
        if user.profilePic:
            user_doc["profilePic"] = user.profilePic

        result = await db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)

    except HTTPException:
        raise
    except pymongo.errors.PyMongoError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database service unavailable: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

    token = create_access_token({"sub": email, "user_id": user_id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": build_user_response(user_id, user_doc),
    }


async def handle_login(user: UserLogin, request: Request):
    db = request.app.database
    email = user.email.strip().lower()

    if not email or not user.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required."
        )

    try:
        db_user = await db.users.find_one({"email": email})
    except pymongo.errors.PyMongoError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database service unavailable: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    stored_password = db_user.get("password", "")
    if not verify_password(user.password, stored_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    user_id = str(db_user["_id"])
    token = create_access_token({"sub": db_user["email"], "user_id": user_id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": build_user_response(user_id, db_user),
    }


# Register routes (both /register and /auth/register for compatibility)
@router.post("/register")
@router.post("/auth/register")
async def register_user(user: User, request: Request):
    return await handle_register(user, request)


# Login routes (both /login and /auth/login for compatibility)
@router.post("/login")
@router.post("/auth/login")
async def login_user(user: UserLogin, request: Request):
    return await handle_login(user, request)


# Current user endpoint
@router.get("/me")
@router.get("/auth/me")
async def get_current_user_profile(
    request: Request,
    authorization: Optional[str] = Header(None)
):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    try:
        payload = decode_token(authorization)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    db = request.app.database
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = None

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {"user": build_user_response(user_id, user)}
