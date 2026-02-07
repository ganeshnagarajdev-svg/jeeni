import asyncio
import os
import httpx
import re
from urllib.parse import urljoin
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
# Import models directly to use them with standalone engine
import sys
# Add parent directory to sys.path to allow imports from 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.models.product import Category, Product, ProductImage
from app.models.general import HomeSection
from app.db.base_class import Base

from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = f"postgresql+asyncpg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_SERVER')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
from slugify import slugify # I will use a simple slugify if not available

from dotenv import load_dotenv
load_dotenv()

def log(msg):
    print(msg)
    log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scrape.log")
    f = open(log_path, "a")
    f.write(str(msg) + "\n")
    f.flush()
    os.fsync(f.fileno())
    f.close()

def get_slug(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

async def download_image(client, url, folder):
    try:
        if not url:
            return None
        filename = url.split('/')[-1].split('?')[0]
        if not filename:
            filename = "image.jpg"
        
        # Ensure unique filename
        path = os.path.join(folder, filename)
        if os.path.exists(path):
            filename = f"{get_slug(filename.split('.')[0])}_{os.urandom(2).hex()}.{filename.split('.')[-1]}"
            path = os.path.join(folder, filename)

        response = await client.get(url, timeout=30.0)
        if response.status_code == 200:
            with open(path, "wb") as f:
                f.write(response.content)
            return f"products/{filename}"
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
    return None

async def scrape_jeeni():
    # Setup directories
    base_dir = os.path.dirname(os.path.abspath(__file__))
    uploads_dir = os.path.join(base_dir, "uploads", "products")
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    async with httpx.AsyncClient(follow_redirects=True) as client:
        log("Fetching shop page...")
        shop_url = "https://jeenimilletmix.in/shop/"
        response = await client.get(shop_url)
        
        product_links = list(set(re.findall(r'https://jeenimilletmix\.in/product/[a-z0-9-]+/', response.text)))
        if not product_links:
            log("No product links found via regex, adding manual links for verification.")
            product_links = [
                "https://jeenimilletmix.in/product/5kg-molake-kattida-ragi-mudde-hittu/",
                "https://jeenimilletmix.in/product/jeeni-adult-500-gms-and-infant-400-gms/"
            ]
        log(f"Found {len(product_links)} products to process.")

        async with AsyncSessionLocal() as db:
            # Create category
            stmt = select(Category).where(Category.name == "Millet Products")
            result = await db.execute(stmt)
            category = result.scalars().first()
            
            if not category:
                category = Category(
                    name="Millet Products",
                    slug="millet-products",
                    description="Delicious and healthy millet-based products from Jeeni."
                )
                db.add(category)
                await db.commit()
                await db.refresh(category)
                log(f"Created category: {category.name}")

            for link in product_links:
                try:
                    log(f"Scraping product: {link}")
                    res = await client.get(link)
                    html = res.text
                    
                    # Extract Name
                    name_match = re.search(r'<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>(.*?)</h1>', html)
                    if not name_match:
                        continue
                    name = name_match.group(1).strip()
                    slug = get_slug(name)
                    
                    # Check if already exists
                    stmt = select(Product).where(Product.slug == slug)
                    res_prod = await db.execute(stmt)
                    if res_prod.scalars().first():
                        log(f"Product {name} already exists, skipping.")
                        continue

                    # Extract Price
                    # Matches both simple and sale prices
                    price_match = re.search(r'<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">.*?</span>(.*?)</bdi></span>', html)
                    price = 0.0
                    if price_match:
                        price_str = price_match.group(1).replace(',', '')
                        try:
                            price = float(price_str)
                        except:
                            pass
                    
                    # Extract Description
                    desc_match = re.search(r'<div class="woocommerce-product-details__short-description">.*?<p>(.*?)</p>', html, re.DOTALL)
                    description = desc_match.group(1).strip() if desc_match else ""
                    
                    # Extract Main Image
                    img_match = re.search(r'<div class="woocommerce-product-gallery__image"[^>]*>.*?<img[^>]*src="(.*?)"', html, re.DOTALL)
                    main_img_url = img_match.group(1) if img_match else None
                    
                    # Create Product
                    product = Product(
                        name=name,
                        slug=slug,
                        description=description,
                        price=price,
                        stock=100,
                        category_id=category.id,
                        is_active=True
                    )
                    db.add(product)
                    await db.flush() # Get ID
                    
                    # Download and save image
                    if main_img_url:
                        local_path = await download_image(client, main_img_url, uploads_dir)
                        if local_path:
                            prod_img = ProductImage(
                                product_id=product.id,
                                image_url=local_path,
                                is_main=True
                            )
                            db.add(prod_img)
                    
                    await db.commit()
                    log(f"Added product: {name}")
                
                except Exception as e:
                    log(f"Error scraping {link}: {e}")
                    await db.rollback()

if __name__ == "__main__":
    asyncio.run(scrape_jeeni())
