import asyncio
import asyncpg
from app.core.config import settings

async def list_users():
    try:
        conn = await asyncpg.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT,
            database=settings.POSTGRES_DB
        )
        print("Connected to database.")
        
        users = await conn.fetch("SELECT id, email, is_active, is_superuser, role FROM public.user")
        for user in users:
            print(f"ID: {user['id']}, Email: {user['email']}, Active: {user['is_active']}, Superuser: {user['is_superuser']}, Role: {user['role']}")
            
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_users())
