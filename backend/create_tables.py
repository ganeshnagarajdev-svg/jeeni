import asyncio
import sys
import os

# Ensure we can import app
sys.path.append(os.getcwd())

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings
from app.models.general import HomeSection
from app.db.base_class import Base

# Model imports to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.product import Product, Category, ProductImage
from app.models.wishlist import Wishlist
from app.models.content import Blog, Media
from app.models.general import Career, Page
from app.models.cart import CartItem
from app.models.order import Order, OrderItem

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

async def run():
    print(f"DATABASE_URL: {SQLALCHEMY_DATABASE_URL}")
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
    
    try:
        print("Checking connection...")
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print(f"Connection successful: {result.scalar()}")

        print("Creating tables...")
        async with engine.begin() as conn:
            # We can also just run the raw SQL if metadata is being finicky
            await conn.run_sync(Base.metadata.create_all)
            
        print("Verification: listing tables...")
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            tables = [row[0] for row in result.fetchall()]
            print(f"Existing tables: {tables}")
            
            if 'homesection' in tables:
                print("SUCCESS: homesection table created.")
            else:
                print("FAILURE: homesection table NOT found.")
                
    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run())
