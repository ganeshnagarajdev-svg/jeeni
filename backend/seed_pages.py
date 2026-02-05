import asyncio
import asyncpg
from app.core.config import settings

async def seed_pages():
    try:
        print(f"Connecting to {settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT} as {settings.POSTGRES_USER}...")
        conn = await asyncpg.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT,
            database=settings.POSTGRES_DB
        )
        print("Connected to database.")

        pages = [
            {
                "title": "About Us",
                "slug": "about-us",
                "content": "<h1>About Jeeni</h1><p>Welcome to Jeeni Millet Mix! We are dedicated to bringing you the best health mixes...</p>",
                "is_published": True
            },
            {
                "title": "Privacy Policy",
                "slug": "privacy-policy",
                "content": "<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>",
                "is_published": True
            },
            {
                "title": "Contact Us",
                "slug": "contact-us",
                "content": "<h1>Contact Us</h1><p>We'd love to hear from you! Reach out to us for any queries, feedback, or support.</p><h2>Get in Touch</h2><p><strong>Email:</strong> support@jeenimilletmix.com</p><p><strong>Phone:</strong> +91 98765 43210</p><p><strong>Address:</strong> 123 Health Street, Wellness City, India 560001</p><h2>Business Hours</h2><p>Monday - Saturday: 9:00 AM - 6:00 PM</p><p>Sunday: Closed</p>",
                "is_published": True
            }
        ]

        for page in pages:
            # Check if slug exists
            exists = await conn.fetchval("SELECT 1 FROM page WHERE slug = $1", page['slug'])
            if not exists:
                await conn.execute(
                    "INSERT INTO page (title, slug, content, is_published) VALUES ($1, $2, $3, $4)",
                    page['title'], page['slug'], page['content'], page['is_published']
                )
                print(f"Seeded page: {page['title']}")
            else:
                print(f"Page already exists: {page['title']}")

        await conn.close()
        print("Seeding completed.")
    except Exception as e:
        print(f"Seeding failed: {e}")

if __name__ == "__main__":
    asyncio.run(seed_pages())
