from fastapi import FastAPI
from routes import test, auth, users,payment
import motor.motor_asyncio
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from middleware.size_limit import LimitUploadSizeMiddleware
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI()

APP_URL = os.getenv("APP_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")
# MongoDB Setup
MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client[os.getenv("DB_NAME")]
app.database = database  # Attach to app so it can be accessed via request.app.database

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", FRONTEND_URL],  # Vite frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(test.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(payment.router)

# Register middleware
app.add_middleware(LimitUploadSizeMiddleware)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return {"message": "Welcome to GetTest AI Backend"}