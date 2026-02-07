import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
from app.db.session import AsyncSessionLocal
from app.models.product import Category, Product, ProductImage
from sqlalchemy import select

async def seed_test():
    async with AsyncSessionLocal() as db:
        print("Checking/Creating category...")
        stmt = select(Category).where(Category.name == "Millet Products")
        result = await db.execute(stmt)
        category = result.scalars().first()
        
        if not category:
            category = Category(
                name="Millet Products",
                slug="millet-products",
                description="Test Category"
            )
            db.add(category)
            await db.commit()
            await db.refresh(category)
            print("Category created.")
        else:
            print("Category exists.")

        print("Adding test product...")
        product = Product(
            name="Jeeni Test Product",
            slug="jeeni-test-product",
            description="Test Description",
            price=100.0,
            stock=100,
            category_id=category.id
        )
        db.add(product)
        try:
            await db.commit()
            print("Product added successfully.")
        except Exception as e:
            print(f"Error adding product: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(seed_test())
