from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

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
