import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Hardcoded for reliability during this step
SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://postgres:root@127.0.0.1:5432/jeeni_db"

async def run_migrations():
    print(f"Connecting to: {SQLALCHEMY_DATABASE_URL}")
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
    
    migrations = [
        "ALTER TABLE product ADD COLUMN IF NOT EXISTS gst_rate FLOAT DEFAULT 0.0",
        'ALTER TABLE "order" ADD COLUMN IF NOT EXISTS total_gst FLOAT DEFAULT 0.0',
        "ALTER TABLE order_item ADD COLUMN IF NOT EXISTS gst_rate_at_purchase FLOAT DEFAULT 0.0",
        "ALTER TABLE order_item ADD COLUMN IF NOT EXISTS gst_amount_at_purchase FLOAT DEFAULT 0.0",
    ]
    
    try:
        async with engine.begin() as conn:
            for sql in migrations:
                await conn.execute(text(sql))
        with open("migration_done.txt", "w") as f:
            f.write("SUCCESS")
    except Exception as e:
        with open("migration_done.txt", "w") as f:
            f.write(f"FAILED: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migrations())
