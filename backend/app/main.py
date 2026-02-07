from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import logging
from app.core.logging import logger
from app.core.config import settings

app = FastAPI(
    title="Jeeni E-commerce API",
    description="API for Jeeni Millet Mix E-commerce platform",
    version="1.0.0",
)

@app.on_event("startup")
async def startup_event():
    from app.db.base_class import Base
    from app.db.session import engine, AsyncSessionLocal
    from app.models.general import HomeSection
    from app.core.cache import cache
    
    await cache.connect()
    from sqlalchemy import select
    import json
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed initial home sections if table is empty
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(HomeSection).limit(1))
        if not result.scalars().first():
            print("Seeding initial home sections...")
            from seed_home import seed_home_sections
            await seed_home_sections()
            
    print("Startup: Database tables verified/created.")

# CORS Middleware config
# CORS Middleware config
origins = settings.BACKEND_CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
# app.add_middleware(TrustedHostMiddleware, allowed_hosts=["jeeni.com", "*.jeeni.com", "localhost"])

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )

# Static files for uploads
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

from app.routers.v1.api import api_router


app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Jeeni E-commerce API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
