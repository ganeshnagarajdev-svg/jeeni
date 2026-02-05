import asyncio
import asyncpg
import sys
from app.core.config import settings

async def seed_pages():
    try:
        if sys.platform == 'win32':
             asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
        print(f"Connecting to {settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT} as {settings.POSTGRES_USER}...", flush=True)
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
                "content": """
<h1>About Jeeni</h1>

<h3>Sri Dilip Kumar & Jeeni – A Journey of Health, Hope, and Rural Empowerment</h3>
<p>At the heart of Jeevita Enterprises, the creators of Jeeni Millet Health Mix, is the inspiring story of Sri Dileep Kumar — a visionary entrepreneur with deep roots in rural Karnataka and an unshakable commitment to social welfare.<br>
Born on July 15, 1984, in a humble farming family in Yeragunte village, Sira Taluk, Tumkur District, Dileep Kumar grew up experiencing the real struggles of rural life. Despite limited resources, he completed his PUC education and dedicated himself to uplifting others in his community.</p>

<h3>From Ground to Growth – Our Journey</h3>
<p>What began as a modest effort — first as a contractor, then in the cleaning chemical industry — evolved into a purpose-driven enterprise rooted in nutrition and well-being.<br>
The breakthrough came with a family-inspired idea: a homemade millet mix shared by his mother-in-law, Smt. Ammajjamma, sparked a vision to create affordable, healthy, millet-based nutrition. Dileep and his wife began producing small packs of this wholesome mix, soon giving rise to what would become "Jeeni".<br>
Launched on July 30, 2020, during the height of the COVID-19 pandemic, Jeeni Millet Health Mix quickly became a household name across Karnataka — trusted for its immunity-boosting and nutritional benefits.</p>

<h3>Our Impact</h3>
<ul>
    <li><strong>🛡️ Health During Crisis:</strong> Provided essential nutrition during COVID-19 when immunity was more critical than ever.</li>
    <li><strong>🧑‍🌾 Rural Employment:</strong> From a 10-member team, we now employ 300–350 rural workers, supporting livelihoods for families in need.</li>
    <li><strong>❤️ Community Service:</strong>
        <ul>
            <li>Partnered with the Pradhan Mantri TB Mukt Bharat Abhiyan as a Ni-Kshay Mitra, supporting 350+ TB patients across Karnataka with nutritious millet-based food.</li>
            <li>Honored by the Governor of Karnataka for contributions toward a TB-free Karnataka.</li>
            <li>Helped rebuild schools and hospitals in Sira Taluk and provided infrastructure support for rural development.</li>
            <li>Brought economic and social transformation to Yeragunte village and surrounding areas.</li>
        </ul>
    </li>
</ul>

<h3>Our Vision</h3>
<ul>
    <li>🌾 Promote the health benefits of millets and encourage sustainable farming practices.</li>
    <li>🏘️ Create more employment opportunities in rural areas, helping realize Mahatma Gandhi’s dream of rural empowerment.</li>
    <li>💚 Build a healthier society through awareness, accessibility, and innovation in traditional food systems.</li>
</ul>

<h2>What’s in Your Jeeni?</h2>
<p>Jeeni Millet Health Mix is an Indian brand specializing in natural and additive-free nutritional products. Founded in 2021 by Dhanalaxmi and Dileep Kumar in Tumakuru, Karnataka, the company offers a range of health mixes — including millet-based, multigrain, and infant-friendly products.<br>
Our mission is simple: to offer healthy, organic alternatives to conventional food, helping you and your family thrive.</p>

<h3>Start Your Day Right!</h3>
<p>Made with 100% natural and organic ingredients, our health mix is carefully crafted to bring you a perfect balance of taste and nutrition. With 24+ wholesome ingredients, our multigrain porridge mix is:</p>
<ul>
    <li>❌ Free from preservatives</li>
    <li>❌ Free from artificial colors</li>
    <li>❌ Free from added sugars</li>
</ul>
<p>It’s a nutrient-packed superfood designed to energize your body and mind — naturally.</p>

<h3>Why Jeeni Stands Out</h3>
<ul>
    <li><strong>✅ A Complete Balanced Meal:</strong> Each serving is loaded with proteins, carbohydrates, healthy fats, and a variety of natural vitamins and minerals — supporting strength, energy, and immunity.</li>
    <li><strong>✅ Rich in Dietary Fiber:</strong> Helps maintain a healthy digestive system, leaving you light, active, and energized.</li>
    <li><strong>✅ Iron for Vitality:</strong> Iron-rich ingredients help in building healthy blood, supporting brain function, and boosting immunity — keeping you sharp and strong.</li>
</ul>
""",
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
                "content": """
<h1>Contact Us</h1>

<h3>Head Office</h3>
<p>Jeevitha Enterprises<br>
Yargunte, Ratnasandra (P), Kasaba Hobli,<br>
Sira (T), Tumkur (D),<br>
Karnataka, India - 572137</p>
<p><a href="https://maps.app.goo.gl/pF6P3AdyFnzEpouE9" target="_blank">View on Google Maps</a></p>

<h3>Contact Info</h3>
<p><strong>Email:</strong> <a href="mailto:contactus@jeenimilletsmix.in">contactus@jeenimilletsmix.in</a></p>
""",
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
                print(f"Seeded page: {page['title']}", flush=True)
            else:
                await conn.execute(
                    "UPDATE page SET title = $1, content = $2, is_published = $3 WHERE slug = $4",
                    page['title'], page['content'], page['is_published'], page['slug']
                )
                print(f"Updated page: {page['title']}", flush=True)

        await conn.close()
        print("Seeding completed.", flush=True)
    except Exception as e:
        print(f"Seeding failed: {e}", flush=True)

if __name__ == "__main__":
    asyncio.run(seed_pages())
