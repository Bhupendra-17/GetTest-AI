import os
import jwt
import time
from dotenv import load_dotenv
from jwt import ExpiredSignatureError, InvalidTokenError

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "secret")

def create_access_token(data: dict):
    payload = data.copy()
    payload.update({"exp": time.time() + 7200})  # 2 hour
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def decode_token(token: str) -> dict:
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return decoded
    except ExpiredSignatureError:
        raise InvalidTokenError("Token has expired")
    except InvalidTokenError as e:
        raise InvalidTokenError(f"Invalid token: {str(e)}")
