import asyncio
import sys
from app.db.session import AsyncSessionLocal
from app.services.cart_service import cart_service
from app.models.user import User
from sqlalchemy.future import select

async def check_cart():
    async with AsyncSessionLocal() as db:
        user_id = 1
        print(f"Checking cart for User ID: {user_id}")
        
        cart_items = await cart_service.get_cart_items(db, user_id=user_id)
        
        if not cart_items:
            print("Cart is EMPTY.")
        else:
            print(f"Found {len(cart_items)} items in cart:")
            for item in cart_items:
                product_name = item.product.name if item.product else "<DELETED PRODUCT>"
                print(f" - CartItem ID: {item.id}, Product ID: {item.product_id} ({product_name}), Qty: {item.quantity}")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_cart())
