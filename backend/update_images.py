"""
Script to fetch actual image URLs from Jeeni website and update products.
"""
import os
import re
import asyncio
import httpx
import psycopg2
from dotenv import load_dotenv

load_dotenv()

print("Starting script...", flush=True)

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

print("Connected to database!", flush=True)

# Product slugs and their URLs
PRODUCT_URLS = {
    "5kg-molake-kattida-ragi-mudde-hittu": "https://jeenimilletmix.in/product/5kg-molake-kattida-ragi-mudde-hittu/",
    "jeeni-adult-500-gms-and-infant-400-gms": "https://jeenimilletmix.in/product/jeeni-adult-500-gms-and-infant-400-gms/",
    "jeeni-adult-500-gms-and-junior-500-gms": "https://jeenimilletmix.in/product/jeeni-adult-500-gms-and-junior-500-gms/",
    "jeeni-adult-500-gms-and-womens-500-gms": "https://jeenimilletmix.in/product/jeeni-adult-500-gms-and-womens-500-gms/",
    "jeeni-coconut-oil-1-ltr": "https://jeenimilletmix.in/product/jeeni-coconut-oil-1-ltr/",
    "jeeni-coconut-oil-2-ltr": "https://jeenimilletmix.in/product/jeeni-coconut-oil-2-ltr/",
    "jeeni-coconut-oil-5-litre": "https://jeenimilletmix.in/product/jeeni-coconut-oil-5-litre/",
    "coconut-pari-cookies": "https://jeenimilletmix.in/product/coconut-pari-cookies/",
    "jeeni-millet-mix-adult-500-gm": "https://jeenimilletmix.in/product/jeeni-millet-mix-adult-500-gm/",
    "jeeni-infants-400gm": "https://jeenimilletmix.in/product/jeeni-infants-400gm/",
}

def download_image_with_requests(url, folder):
    """Download image using httpx with proper headers."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://jeenimilletmix.in/'
        }
        with httpx.Client(follow_redirects=True, timeout=30.0) as client:
            response = client.get(url, headers=headers)
            if response.status_code == 200:
                filename = url.split('/')[-1].split('?')[0]
                path = os.path.join(folder, filename)
                with open(path, 'wb') as f:
                    f.write(response.content)
                print(f"Downloaded: {filename}")
                return f"products/{filename}"
            else:
                print(f"Failed to download {url}: HTTP {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return None

def extract_image_url(html):
    """Extract product image URL from HTML."""
    # Try to find og:image meta tag first
    og_match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    if og_match:
        return og_match.group(1)
    
    # Try to find main product image
    img_match = re.search(r'woocommerce-product-gallery__image[^>]*>.*?<img[^>]*src="([^"]+)"', html, re.DOTALL)
    if img_match:
        return img_match.group(1)
    
    # Try data-src attribute
    data_src_match = re.search(r'woocommerce-product-gallery__image[^>]*>.*?<img[^>]*data-src="([^"]+)"', html, re.DOTALL)
    if data_src_match:
        return data_src_match.group(1)
    
    return None

def fetch_and_update_images():
    print("Starting image update...", flush=True)
    
    # Create uploads directory
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads", "products")
    os.makedirs(uploads_dir, exist_ok=True)
    print(f"Uploads directory: {uploads_dir}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    
    with httpx.Client(follow_redirects=True, timeout=30.0) as client:
        for slug, url in PRODUCT_URLS.items():
            print(f"\nProcessing: {slug}")
            
            # Get product ID
            cursor.execute("SELECT id FROM product WHERE slug = %s", (slug,))
            result = cursor.fetchone()
            if not result:
                print(f"  Product not found in database, skipping.")
                continue
            product_id = result[0]
            
            # Check if product already has an image
            cursor.execute("SELECT id FROM productimage WHERE product_id = %s", (product_id,))
            if cursor.fetchone():
                print(f"  Product already has image, skipping.")
                continue
            
            try:
                # Fetch product page
                response = client.get(url, headers=headers)
                if response.status_code != 200:
                    print(f"  Failed to fetch page: HTTP {response.status_code}")
                    continue
                
                html = response.text
                
                # Extract image URL
                image_url = extract_image_url(html)
                if not image_url:
                    print(f"  No image URL found in page.")
                    continue
                
                print(f"  Found image: {image_url}")
                
                # Download image
                local_path = download_image_with_requests(image_url, uploads_dir)
                if local_path:
                    cursor.execute(
                        "INSERT INTO productimage (product_id, image_url, is_main) VALUES (%s, %s, %s)",
                        (product_id, local_path, True)
                    )
                    conn.commit()
                    print(f"  Image added to database.")
                else:
                    print(f"  Failed to download image.")
                    
            except Exception as e:
                print(f"  Error: {e}")
                conn.rollback()
    
    print("\nImage update completed!")

if __name__ == "__main__":
    try:
        fetch_and_update_images()
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
