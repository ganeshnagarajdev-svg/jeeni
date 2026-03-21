import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

# Ensure we can import app
sys.path.append(os.getcwd())

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

async def run_migrations():
    print(f"Connecting to: {SQLALCHEMY_DATABASE_URL}")
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
    
    migrations = [
        # Add gst_rate to product
        "ALTER TABLE product ADD COLUMN IF NOT EXISTS gst_rate FLOAT DEFAULT 0.0",
        
        # Add total_gst to order (using double quotes for 'order' reserved word)
        'ALTER TABLE "order" ADD COLUMN IF NOT EXISTS total_gst FLOAT DEFAULT 0.0',
        
        # Add gst fields to order_item
        "ALTER TABLE order_item ADD COLUMN IF NOT EXISTS gst_rate_at_purchase FLOAT DEFAULT 0.0",
        "ALTER TABLE order_item ADD COLUMN IF NOT EXISTS gst_amount_at_purchase FLOAT DEFAULT 0.0",
    ]
    
    try:
        async with engine.begin() as conn:
            for sql in migrations:
                print(f"Executing: {sql}")
                await conn.execute(text(sql))
        print("Migrations applied successfully!")
    except Exception as e:
        print(f"Error applying migrations: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migrations())
