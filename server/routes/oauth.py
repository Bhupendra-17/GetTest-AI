from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from datetime import datetime, timedelta
from jose import jwt
import httpx
import os

router = APIRouter()

# OAuth config
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")  
SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.get("/auth/google/login")
async def google_login():
    # Redirect to Google's OAuth 2.0 server
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
    )
    return RedirectResponse(google_auth_url)

@router.get("/auth/google/callback")
async def google_callback(code: str, request: Request):
    # --- exchange code for token ---
    token_url = "https://oauth2.googleapis.com/token"
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(token_url, data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code"
        })
        token_data = token_resp.json()

    if "error" in token_data:
        raise HTTPException(status_code=400, detail=token_data["error"])

    access_token = token_data["access_token"]

    # --- get user info ---
    async with httpx.AsyncClient() as client:
        user_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info = user_resp.json()

    email = user_info["email"]
    name = user_info.get("name", email.split("@")[0])
    picture = user_info.get("picture")

    # --- DB lookup / insert ---
    db = request.app.database
    db_user = await db.users.find_one({"email": email})
    if not db_user:
        result = await db.users.insert_one({
            "name": name,
            "email": email,
            "profilePic": picture,
            "gender": "unspecified",
            "created_at": datetime.utcnow()
        })
        user_id = str(result.inserted_id)
    else:
        user_id = str(db_user["_id"])

    # --- create JWT ---
    jwt_token = create_access_token({"sub": email, "user_id": user_id})

    # --- redirect with user info ---
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    redirect_url = (
        f"{frontend_url}/auth/callback?"
        f"token={jwt_token}"
        f"&id={user_id}"
        f"&name={name}"
        f"&email={email}"
        f"&pic={picture}"
    )

    return RedirectResponse(redirect_url)
