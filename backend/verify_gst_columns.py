import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

# Ensure we can import app
sys.path.append(os.getcwd())

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

async def verify_columns():
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
    results = {}
    try:
        async with engine.connect() as conn:
            # Check product
            res = await conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'product' AND column_name = 'gst_rate'"))
            results['product.gst_rate'] = bool(res.scalar())
            
            # Check order
            res = await conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'order' AND column_name = 'total_gst'"))
            results['order.total_gst'] = bool(res.scalar())
            
            # Check order_item
            res = await conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'order_item' AND column_name = 'gst_rate_at_purchase'"))
            results['order_item.gst_rate_at_purchase'] = bool(res.scalar())
            
            res = await conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'order_item' AND column_name = 'gst_amount_at_purchase'"))
            results['order_item.gst_amount_at_purchase'] = bool(res.scalar())
            
        with open("migration_verify.txt", "w") as f:
            for k, v in results.items():
                f.write(f"{k}: {'Exists' if v else 'Missing'}\n")
    except Exception as e:
        with open("migration_verify.txt", "w") as f:
            f.write(f"Error: {str(e)}\n")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(verify_columns())
