"""
Synchronous seed script for Jeeni products using psycopg2.
"""
import os
import psycopg2
import httpx
from dotenv import load_dotenv

load_dotenv()

# Database connection
conn = psycopg2.connect(
    host=os.getenv('POSTGRES_SERVER', '127.0.0.1'),
    port=os.getenv('POSTGRES_PORT', '5432'),
    user=os.getenv('POSTGRES_USER', 'postgres'),
    password=os.getenv('POSTGRES_PASSWORD', 'root'),
    database=os.getenv('POSTGRES_DB', 'jeeni_db')
)
conn.autocommit = False
cursor = conn.cursor()

print("Connected to database!")

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

def download_image(url, folder):
    """Download an image from URL and save to folder."""
    try:
        import urllib.request
        filename = url.split('/')[-1].split('?')[0]
        path = os.path.join(folder, filename)
        urllib.request.urlretrieve(url, path)
        return f"products/{filename}"
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return None

def seed_products():
    print("Starting product seeding...")
    
    # Create uploads directory
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads", "products")
    os.makedirs(uploads_dir, exist_ok=True)
    print(f"Uploads directory: {uploads_dir}")
    
    # Create or get category
    cursor.execute("SELECT id FROM category WHERE name = %s", ("Millet Products",))
    result = cursor.fetchone()
    
    if result:
        category_id = result[0]
        print(f"Using existing category ID: {category_id}")
    else:
        cursor.execute(
            "INSERT INTO category (name, slug, description, is_active) VALUES (%s, %s, %s, %s) RETURNING id",
            ("Millet Products", "millet-products", "Delicious and healthy millet-based products from Jeeni.", True)
        )
        category_id = cursor.fetchone()[0]
        conn.commit()
        print(f"Created category ID: {category_id}")
    
    # Add products
    for prod_data in JEENI_PRODUCTS:
        # Check if product exists
        cursor.execute("SELECT id FROM product WHERE slug = %s", (prod_data["slug"],))
        if cursor.fetchone():
            print(f"Product '{prod_data['name']}' already exists, skipping.")
            continue
        
        # Create product
        cursor.execute(
            """INSERT INTO product (name, slug, description, price, discounted_price, stock, is_active, is_featured, category_id)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (
                prod_data["name"],
                prod_data["slug"],
                prod_data["description"],
                prod_data["price"],
                prod_data.get("discounted_price"),
                100,
                True,
                False,
                category_id
            )
        )
        product_id = cursor.fetchone()[0]
        
        # Download and save image
        if prod_data.get("image_url"):
            local_path = download_image(prod_data["image_url"], uploads_dir)
            if local_path:
                cursor.execute(
                    "INSERT INTO productimage (product_id, image_url, is_main) VALUES (%s, %s, %s)",
                    (product_id, local_path, True)
                )
                print(f"Added product: {prod_data['name']} with image")
            else:
                print(f"Added product: {prod_data['name']} (no image)")
        else:
            print(f"Added product: {prod_data['name']} (no image URL)")
    
    conn.commit()
    print("Product seeding completed!")

if __name__ == "__main__":
    try:
        seed_products()
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
