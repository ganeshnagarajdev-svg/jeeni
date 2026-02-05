import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def seed_sqlalchemy():
    print(f"Connecting using SQLAlchemy to {settings.POSTGRES_SERVER}...")
    engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI)
    try:
        async with engine.begin() as conn:
            print("Connected!")
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
                }
            ]
            
            for page in pages:
                # Check exists
                result = await conn.execute(
                    text("SELECT 1 FROM page WHERE slug = :slug"),
                    {"slug": page["slug"]}
                )
                if not result.first():
                    await conn.execute(
                        text("INSERT INTO page (title, slug, content, is_published) VALUES (:title, :slug, :content, :is_published)"),
                        page
                    )
                    print(f"Seeded: {page['title']}")
                else:
                    print(f"Exists: {page['title']}")
                    
        print("Done.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_sqlalchemy())
