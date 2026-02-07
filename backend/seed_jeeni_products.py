"""
Seed products from Jeeni website data.
This script inserts products directly using data extracted from https://jeenimilletmix.in/
"""
import os
import asyncio
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Direct imports after ensuring path is correct
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.product import Category, Product, ProductImage
from app.db.base_class import Base

# Database connection
DATABASE_URL = f"postgresql+asyncpg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_SERVER')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Products from Jeeni website (manually extracted)
JEENI_PRODUCTS = [
    {
        "name": "5Kg Molake Kattida Ragi Mudde Hittu",
        "slug": "5kg-molake-kattida-ragi-mudde-hittu",
        "description": "Molake Kattida Ragi Mudde Hittu — Sprouted Finger Millet Flour for Soft & Nutritious Mudde | Rich in Calcium, Iron & Fiber | 100% Natural & Wholesome",
        "price": 799.0,
        "discounted_price": 765.0,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2025/01/5KG-RAGI-MUDEE-NEW-scaled.jpg"
    },
    {
        "name": "Jeeni Adult 500 gms and Infant 400 gms",
        "slug": "jeeni-adult-500-gms-and-infant-400-gms",
        "description": "Combo pack of Jeeni Adult 500 gms and Infant 400 gms millet mix for the whole family.",
        "price": 483.0,
        "discounted_price": 473.0,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/03/Adult-500gm-Infants-400gm-combo.png"
    },
    {
        "name": "Jeeni Adult 500 gms and Junior 500 gms",
        "slug": "jeeni-adult-500-gms-and-junior-500-gms",
        "description": "Combo pack of Jeeni Adult 500 gms and Junior 500 gms millet mix.",
        "price": 507.0,
        "discounted_price": 497.0,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/03/Adult-500gm-junior-500gm-combo.png"
    },
    {
        "name": "Jeeni Adult 500 gms and Womens 500 gms",
        "slug": "jeeni-adult-500-gms-and-womens-500-gms",
        "description": "Combo pack of Jeeni Adult 500 gms and Womens 500 gms millet mix.",
        "price": 530.0,
        "discounted_price": 520.0,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/03/Adult-500gm-womens-500gm-combo.png"
    },
    {
        "name": "JEENI COCONUT OIL 1 LTR",
        "slug": "jeeni-coconut-oil-1-ltr",
        "description": "Pure Jeeni Coconut Oil - 1 Litre. Cold pressed and natural.",
        "price": 350.0,
        "discounted_price": None,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/09/Jeeni-Coconut-Oil-1-LTR.png"
    },
    {
        "name": "JEENI COCONUT OIL 2 LTR",
        "slug": "jeeni-coconut-oil-2-ltr",
        "description": "Pure Jeeni Coconut Oil - 2 Litres. Cold pressed and natural.",
        "price": 680.0,
        "discounted_price": None,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/09/Jeeni-Coconut-Oil-2-LTR.png"
    },
    {
        "name": "Jeeni Coconut Oil 5 litre",
        "slug": "jeeni-coconut-oil-5-litre",
        "description": "Pure Jeeni Coconut Oil - 5 Litres. Cold pressed and natural. Best value pack.",
        "price": 1650.0,
        "discounted_price": None,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/09/Jeeni-Coconut-Oil-5-LTR.png"
    },
    {
        "name": "Coconut Pari Cookies 75Gms",
        "slug": "coconut-pari-cookies",
        "description": "Delicious Coconut Pari Cookies made with healthy ingredients. 75 grams pack.",
        "price": 35.0,
        "discounted_price": None,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/12/Coconut-Pari-Cookies-75Gms.png"
    },
    {
        "name": "Jeeni Millet Mix Adult - 500 Gm",
        "slug": "jeeni-millet-mix-adult-500-gm",
        "description": "Jeeni Millet Mix for Adults - 500 grams. A healthy millet-based nutrition mix.",
        "price": 253.0,
        "discounted_price": 248.0,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/03/Jeeni-Adult-500gm.png"
    },
    {
        "name": "Jeeni Infants 400gm",
        "slug": "jeeni-infants-400gm",
        "description": "Jeeni Millet Mix for Infants - 400 grams. Specially formulated for babies.",
        "price": 230.0,
        "discounted_price": 225.0,
        "image_url": "https://jeenimilletmix.in/wp-content/uploads/2024/03/Jeeni-Infants-400gm.png"
    }
]

async def download_image(url, folder):
    """Download an image from URL and save to folder."""
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(url, timeout=30.0)
            if response.status_code == 200:
                filename = url.split('/')[-1].split('?')[0]
                path = os.path.join(folder, filename)
                with open(path, 'wb') as f:
                    f.write(response.content)
                return f"products/{filename}"
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return None

async def seed_products():
    print("Starting product seeding...")
    
    # Create uploads directory
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads", "products")
    os.makedirs(uploads_dir, exist_ok=True)
    print(f"Uploads directory: {uploads_dir}")
    
    async with AsyncSessionLocal() as db:
        # Create or get category
        stmt = select(Category).where(Category.name == "Millet Products")
        result = await db.execute(stmt)
        category = result.scalars().first()
        
        if not category:
            category = Category(
                name="Millet Products",
                slug="millet-products",
                description="Delicious and healthy millet-based products from Jeeni.",
                is_active=True
            )
            db.add(category)
            await db.commit()
            await db.refresh(category)
            print(f"Created category: {category.name} (ID: {category.id})")
        else:
            print(f"Using existing category: {category.name} (ID: {category.id})")
        
        # Add products
        for prod_data in JEENI_PRODUCTS:
            # Check if product exists
            stmt = select(Product).where(Product.slug == prod_data["slug"])
            result = await db.execute(stmt)
            existing = result.scalars().first()
            
            if existing:
                print(f"Product '{prod_data['name']}' already exists, skipping.")
                continue
            
            # Create product
            product = Product(
                name=prod_data["name"],
                slug=prod_data["slug"],
                description=prod_data["description"],
                price=prod_data["price"],
                discounted_price=prod_data.get("discounted_price"),
                stock=100,
                is_active=True,
                is_featured=False,
                category_id=category.id
            )
            db.add(product)
            await db.flush()
            
            # Download and save image
            if prod_data.get("image_url"):
                local_path = await download_image(prod_data["image_url"], uploads_dir)
                if local_path:
                    img = ProductImage(
                        product_id=product.id,
                        image_url=local_path,
                        is_main=True
                    )
                    db.add(img)
                    print(f"Added product: {prod_data['name']} with image")
                else:
                    print(f"Added product: {prod_data['name']} (no image)")
            else:
                print(f"Added product: {prod_data['name']} (no image URL)")
        
        await db.commit()
        print("Product seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_products())
