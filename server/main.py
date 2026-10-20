from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from routes import test, auth, users, payment, oauth, test_history, sectional
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
raw_frontend = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
if raw_frontend and raw_frontend not in allowed_origins:
    allowed_origins.append(raw_frontend)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc) or "Internal server error"},
    )


# Include Routers
app.include_router(test.router)
app.include_router(auth.router)
app.include_router(oauth.router)
app.include_router(users.router)
app.include_router(payment.router)
app.include_router(test_history.router)
app.include_router(sectional.router)

@app.get("/")
async def root():
    return {"message": "Welcome to GetTest AI Backend"}