from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from datetime import datetime
import urllib.parse
import httpx
import os
from utils.jwt_handler import create_access_token

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")


@router.get("/auth/google/login")
async def google_login():
    if not GOOGLE_CLIENT_ID or not REDIRECT_URI:
        raise HTTPException(status_code=500, detail="Google OAuth not configured on server.")
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={urllib.parse.quote(REDIRECT_URI, safe='')}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
    )
    return RedirectResponse(google_auth_url)


@router.get("/auth/google/callback")
async def google_callback(code: str, request: Request):
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
        raise HTTPException(status_code=400, detail=token_data.get("error_description", token_data["error"]))

    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to retrieve access token from Google.")

    async with httpx.AsyncClient() as client:
        user_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info = user_resp.json()

    raw_email = user_info.get("email")
    if not raw_email:
        raise HTTPException(status_code=400, detail="Google account did not provide an email.")

    email = raw_email.strip().lower()
    name = (user_info.get("name") or email.split("@")[0]).strip()
    picture = user_info.get("picture", "")

    db = request.app.database
    db_user = await db.users.find_one({"email": email})
    if not db_user:
        user_doc = {
            "name": name,
            "email": email,
            "created_at": datetime.utcnow()
        }
        if picture:
            user_doc["profilePic"] = picture
        result = await db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
    else:
        user_id = str(db_user["_id"])
        name = db_user.get("name", name)
        picture = db_user.get("profilePic", picture)

    jwt_token = create_access_token({"sub": email, "user_id": user_id})

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    query_params = urllib.parse.urlencode({
        "token": jwt_token,
        "id": user_id,
        "name": name,
        "email": email,
        "pic": picture or ""
    })
    redirect_url = f"{frontend_url}/auth/callback?{query_params}"

    return RedirectResponse(redirect_url)
