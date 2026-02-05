from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title="Jeeni E-commerce API",
    description="API for Jeeni Millet Mix E-commerce platform",
    version="1.0.0",
)

# CORS Middleware config
origins = [
    "http://localhost",
    "http://localhost:4200",  # Angular default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

from app.routers.v1.api import api_router
from app.core.config import settings

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Jeeni E-commerce API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
