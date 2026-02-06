import asyncio
import asyncpg
import sys
import os

from app.core.config import settings

async def run_raw_sql():
    print(f"Connecting to jeeni_db as {settings.POSTGRES_USER}...")
    try:
        conn = await asyncpg.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database=settings.POSTGRES_DB,
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT
        )
        print("Connected.")
        
        sql = """
        CREATE TABLE IF NOT EXISTS homesection (
            id SERIAL PRIMARY KEY,
            title VARCHAR,
            section_type VARCHAR NOT NULL,
            configuration TEXT,
            "order" INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE
        );
        CREATE INDEX IF NOT EXISTS ix_homesection_id ON homesection (id);
        """
        print("Executing CREATE TABLE...")
        await conn.execute(sql)
        print("SQL executed successfully.")
        
        # Verify
        rows = await conn.fetch("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [row['table_name'] for row in rows]
        print(f"Tables in public: {tables}")
        
        if 'homesection' in tables:
            print("VERIFIED: homesection table exists.")
        else:
            print("ERROR: Table still missing.")
            
        await conn.close()
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    asyncio.run(run_raw_sql())
