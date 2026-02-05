import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

async def test_conn():
    try:
        engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI)
        async with engine.connect() as conn:
            print("Connection successful!")
        await engine.dispose()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_conn())
