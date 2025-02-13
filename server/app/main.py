from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import pdf_upload, test_generation

app = FastAPI(title="Mock Test Generator")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(pdf_upload.router)
app.include_router(test_generation.router)

@app.get("/")
def read_root():
    return {"message": "Mock Test Generator Backend"}