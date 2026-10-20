import os
import time
import jwt
from dotenv import load_dotenv
from jwt import ExpiredSignatureError, InvalidTokenError

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def create_access_token(data: dict, expires_in_days: int = 7) -> str:
    payload = data.copy()
    payload.update({"exp": int(time.time() + expires_in_days * 86400)})
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def decode_token(token: str) -> dict:
    if not token:
        raise InvalidTokenError("Missing token")
    if token.startswith("Bearer "):
        token = token[7:].strip()
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded
    except ExpiredSignatureError:
        raise InvalidTokenError("Token has expired")
    except InvalidTokenError as e:
        raise InvalidTokenError(f"Invalid token: {str(e)}")

