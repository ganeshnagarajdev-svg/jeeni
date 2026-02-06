import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

# Database connection URL
SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

async def check_db():
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            tables = [row[0] for row in result.fetchall()]
            with open("db_tables.txt", "w") as f:
                f.write("\n".join(tables))
            print("Done checking DB tables.")
    except Exception as e:
        with open("db_tables.txt", "w") as f:
            f.write(f"Error: {str(e)}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_db())
