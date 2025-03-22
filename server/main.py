from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.test import router as test_router
from server.api.endpoints import generate_question
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GetTest AI Backend")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Route
@app.get("/")
def root():
    return {"message": "Welcome to GetTest AI!"}

# Include Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(test_router, prefix="/test", tags=["Test Generation"])
app.include_router(generate_question.router, prefix="/generate", tags=["Question Generation"])
