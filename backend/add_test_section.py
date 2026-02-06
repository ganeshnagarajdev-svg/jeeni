import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.general import HomeSection
import json

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def add_test_section():
    async with AsyncSessionLocal() as db:
        new_section = HomeSection(
            title="TEST ANNOUNCEMENT",
            section_type="cta",
            configuration=json.dumps({
                "title": "THIS IS A TEST CHANGE",
                "description": "If you see this, the home page is working correctly.",
                "placeholder": "Testing...",
                "btn_text": "Verify"
            }),
            order=-1, # Put it at the top
            is_active=True
        )
        db.add(new_section)
        await db.commit()
    print("Test section added at the top.")

if __name__ == "__main__":
    asyncio.run(add_test_section())
