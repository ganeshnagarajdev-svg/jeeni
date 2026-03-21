import asyncio
import asyncpg

async def run():
    # Credentials from .env
    conn = await asyncpg.connect(user='postgres', password='root', database='jeeni_db', host='127.0.0.1')
    try:
        print("Connected.")
        await conn.execute("ALTER TABLE product ADD COLUMN IF NOT EXISTS gst_rate FLOAT DEFAULT 0.0")
        await conn.execute('ALTER TABLE "order" ADD COLUMN IF NOT EXISTS total_gst FLOAT DEFAULT 0.0')
        await conn.execute("ALTER TABLE orderitem ADD COLUMN IF NOT EXISTS gst_rate_at_purchase FLOAT DEFAULT 0.0")
        await conn.execute("ALTER TABLE orderitem ADD COLUMN IF NOT EXISTS gst_amount_at_purchase FLOAT DEFAULT 0.0")
        print("Migrations complete.")
        with open("migration_status.txt", "w") as f:
            f.write("SUCCESS")
    except Exception as e:
        print(f"Error: {e}")
        with open("migration_status.txt", "w") as f:
            f.write(f"ERROR: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run())
