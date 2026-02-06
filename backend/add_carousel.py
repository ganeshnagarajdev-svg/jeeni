import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.general import HomeSection
import json

SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def add_carousel():
    async with AsyncSessionLocal() as db:
        carousel_section = HomeSection(
            title="Main Home Carousel",
            section_type="carousel",
            configuration=json.dumps({
                "autoplay": True,
                "interval": 5000,
                "items": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070",
                        "title": "Fresh & Organic <span class='text-accent'>Millets</span>",
                        "subtitle": "Discover the power of nature's best grains for a healthier life.",
                        "link": "/shop",
                        "button_text": "Shop Now"
                    },
                    {
                        "image_url": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070",
                        "title": "Traditional Taste, <span class='text-accent'>Modern Health</span>",
                        "subtitle": "Bring back the goodness of traditional Indian health drinks.",
                        "link": "/shop",
                        "button_text": "Explore Collection"
                    },
                    {
                        "image_url": "https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?q=80&w=2070",
                        "title": "Nutrition for <span class='text-accent'>Every Age</span>",
                        "subtitle": "Jeeni provides balanced nutrition for children and adults alike.",
                        "link": "/content/pages/about-us",
                        "button_text": "Our Story"
                    }
                ]
            }),
            order=-2, # Top-most
            is_active=True
        )
        db.add(carousel_section)
        await db.commit()
    print("Carousel section added.")

if __name__ == "__main__":
    asyncio.run(add_carousel())
