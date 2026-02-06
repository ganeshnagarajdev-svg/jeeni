import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

# Database connection URL
SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

async def query_sections():
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT id, title, section_type, configuration, is_active FROM homesection"))
            rows = result.fetchall()
            with open("query_results.txt", "w") as f:
                for row in rows:
                    f.write(f"ID: {row[0]}, Title: {row[1]}, Type: {row[2]}, Active: {row[4]}\n")
                    f.write(f"Config: {row[3]}\n")
                    f.write("-" * 20 + "\n")
            print("Query completed.")
    except Exception as e:
        print(f"Error: {str(e)}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(query_sections())
