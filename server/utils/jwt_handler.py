import os
import jwt
import time
from dotenv import load_dotenv 

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET", "secret")

def create_access_token(data:dict):
    payload = data.copy()
    payload.update({"exp": time.time()+1800}) #0.5 hr
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token