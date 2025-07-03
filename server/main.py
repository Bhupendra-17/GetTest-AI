from fastapi import FastAPI
from routes import test, auth
import motor.motor_asyncio
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from middleware.size_limit import LimitUploadSizeMiddleware

load_dotenv()

app = FastAPI()

# MongoDB Setup
MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client[os.getenv("DB_NAME")]
app.database = database  # Attach to app so it can be accessed via request.app.database

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(test.router)
app.include_router(auth.router)

# Register middleware
app.add_middleware(LimitUploadSizeMiddleware)


@app.get("/")
async def root():
    return {"message": "Welcome to GetTest AI Backend"}