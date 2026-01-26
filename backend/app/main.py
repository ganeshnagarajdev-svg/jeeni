from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

from app.routers.v1.api import api_router
from app.core.config import settings

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Jeeni E-commerce API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
