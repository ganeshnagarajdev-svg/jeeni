import asyncio
import json
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.general import HomeSection
from sqlalchemy import select

# Database connection URL
SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed_home_sections():
    async with AsyncSessionLocal() as db:
        sections = [
            {
                "title": "Hero Section",
                "section_type": "hero",
                "configuration": json.dumps({
                    "title": "Nature's Gold<br/>Jeeni Millets",
                    "subtitle": "100% Natural & Organic",
                    "description": "Rediscover the ancient secret of health. Premium millet mixes crafted for weight loss, energy, and holistic wellness.",
                    "primary_btn_text": "Shop Collection",
                    "primary_btn_link": "/shop",
                    "secondary_btn_text": "Watch Our Story",
                    "secondary_btn_link": "/general/pages/about-us",
                    "image_url": "/assets/images/hero-bowl.svg",
                    "bg_image_url": "/assets/images/hero-bg.svg"
                }),
                "order": 0,
                "is_active": True
            },
            {
                "title": "Features Section",
                "section_type": "features",
                "configuration": json.dumps({
                    "header": "Pure & Primal",
                    "title": "The Jeeni Promise",
                    "subtitle": "We bring you the purest grains, cultivated using traditional methods preserved for thousands of years. No additives, just nature's best.",
                    "features": [
                        {"icon": "🌾", "title": "Gluten-Free", "description": "Gentle on your gut, perfect for digestion. A wholesome alternative to processed grains."},
                        {"icon": "⚖️", "title": "Weight Balance", "description": "High fiber content that keeps you satiated, naturally supporting your weight management goals."},
                        {"icon": "🛡️", "title": "Immunity Boost", "description": "Packed with essential antioxidants to fortify your body's natural defense systems."}
                    ]
                }),
                "order": 1,
                "is_active": True
            },
            {
                "title": "Categories Section",
                "section_type": "categories",
                "configuration": json.dumps({
                    "header": "Curated Collections",
                    "title": "Shop by Category",
                    "categories": [
                        {"name": "Combo Packs", "slug": "combo", "image_url": "/assets/images/hero-bowl.svg"},
                        {"name": "Cookies", "slug": "cookies", "image_url": "/assets/images/hero-bowl.svg"},
                        {"name": "Jeeni Adult", "slug": "adult", "image_url": "/assets/images/hero-bowl.svg"},
                        {"name": "Jeeni Kids", "slug": "kids", "image_url": "/assets/images/hero-bowl.svg"},
                        {"name": "Jeeni Slim", "slug": "slim", "image_url": "/assets/images/hero-bowl.svg"},
                        {"name": "Ready To Cook", "slug": "ready-to-cook", "image_url": "/assets/images/hero-bowl.svg"}
                    ]
                }),
                "order": 2,
                "is_active": True
            },
             {
                "title": "Benefits Section",
                "section_type": "benefits",
                "configuration": json.dumps({
                    "header": "Superfood Benefits",
                    "title": "Why Jeeni Products<br/>Are a Superfood?",
                    "image_url": "/assets/images/pattern-bg.svg",
                    "points": [
                        {"id": 1, "title": "Rich in Nutrients", "description": "Millets are packed with fiber, protein, iron, calcium, and essential vitamins."},
                        {"id": 2, "title": "Regulates Blood Sugar", "description": "Low glycemic index helps in managing diabetes effectively."},
                        {"id": 3, "title": "Good for Heart Health", "description": "Millets help lower cholesterol and improve overall heart function."},
                        {"id": 4, "title": "Eco-Friendly Crop", "description": "Requires less water and can grow in dry conditions, making it sustainable."}
                    ],
                    "usage_title": "Ways to Include Jeeni",
                    "usage_items": [
                        {"icon": "🍚", "text": "Replace rice with millet in meals"},
                        {"icon": "🥣", "text": "Enjoy millet porridge for breakfast"},
                        {"icon": "🥞", "text": "Try millet-based rotis, idlis, or dosas"},
                        {"icon": "🍫", "text": "Snack on millet-based energy bars"}
                    ],
                    "cta_text": "Start Your Journey",
                    "cta_link": "/shop"
                }),
                "order": 3,
                "is_active": True
            },
            {
                "title": "Featured Products Section",
                "section_type": "product_grid",
                "configuration": json.dumps({
                    "header": "Our Collection",
                    "title": "Featured Products",
                    "limit": 4
                }),
                "order": 4,
                "is_active": True
            },
            {
                "title": "Newsletter Section",
                "section_type": "cta",
                "configuration": json.dumps({
                    "title": "Join the Healthy Revolution",
                    "description": "Subscribe to our newsletter for exclusive offers, health tips, and new product launches.",
                    "placeholder": "Enter your email address",
                    "btn_text": "Subscribe"
                }),
                "order": 5,
                "is_active": True
            },
            {
                "title": "Main Home Carousel",
                "section_type": "carousel",
                "configuration": json.dumps({
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
                "order": -1, # At the top
                "is_active": True
            }
        ]

        for s_data in sections:
            # Check if section title exists (simple check for seeding)
            query = select(HomeSection).where(HomeSection.title == s_data["title"])
            result = await db.execute(query)
            section = result.scalars().first()

            if not section:
                new_section = HomeSection(**s_data)
                db.add(new_section)
                print(f"Added section: {s_data['title']}")
            else:
                for key, value in s_data.items():
                    setattr(section, key, value)
                print(f"Updated section: {s_data['title']}")

        await db.commit()
    print("Home sections seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed_home_sections())
