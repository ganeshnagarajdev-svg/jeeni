import asyncio
import asyncpg

async def test():
    try:
        print("Starting test...")
        conn = await asyncpg.connect(user='postgres', password='root', host='127.0.0.1', port='5432', database='jeeni_db')
        print("Connected!")
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
