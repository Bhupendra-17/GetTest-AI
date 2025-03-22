from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.test import router as test_router

app = FastAPI(title="GetTest AI Backend")

# Include Routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(test_router, prefix="/test", tags=["Test Generation"])

@app.get("/")
def root():
    return {"message": "Welcome to GetTest AI!"}
