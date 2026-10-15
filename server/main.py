from fastapi import FastAPI
from routes import test, auth, users, payment, oauth, test_history
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from middleware.size_limit import LimitUploadSizeMiddleware
import motor.motor_asyncio
import os

load_dotenv()

app = FastAPI()

APP_URL = os.getenv("APP_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")
# MongoDB Setup
MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client[os.getenv("DB_NAME", "gettest_ai")]
app.database = database  # Attach to app so it can be accessed via request.app.database

# ✅ Add middleware (registered once)
app.add_middleware(LimitUploadSizeMiddleware)

# CORS configuration
allowed_origins = [origin for origin in ["http://localhost:5173", "http://localhost:3000", FRONTEND_URL] if origin]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(test.router)
app.include_router(auth.router)
app.include_router(oauth.router)
app.include_router(users.router)
app.include_router(payment.router)
app.include_router(test_history.router)

@app.get("/")
async def root():
    return {"message": "Welcome to GetTest AI Backend"}