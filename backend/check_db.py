import asyncio
import asyncpg
from app.core.config import settings

async def check_db():
    try:
        # Try connecting to the default 'postgres' database to check if we can connect at all
        conn = await asyncpg.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT,
            database='postgres'
        )
        print("Successfully connected to Postgres server.")
        
        # Check if jeeni_db exists
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = $1", settings.POSTGRES_DB)
        if not exists:
            print(f"Database {settings.POSTGRES_DB} does not exist. Creating...")
            await conn.execute(f'CREATE DATABASE "{settings.POSTGRES_DB}"')
            print(f"Database {settings.POSTGRES_DB} created!")
        else:
            print(f"Database {settings.POSTGRES_DB} already exists.")
            
        await conn.close()
        return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(check_db())
