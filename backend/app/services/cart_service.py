from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from sqlalchemy.orm import selectinload
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate

class CartService:
    async def get_cart_items(self, db: AsyncSession, user_id: int) -> List[CartItem]:
        query = select(CartItem).options(
            selectinload(CartItem.product).selectinload(Product.category),
            selectinload(CartItem.product).selectinload(Product.images)
        ).where(CartItem.user_id == user_id).order_by(CartItem.id)
        result = await db.execute(query)
        return result.scalars().all()

    async def add_to_cart(self, db: AsyncSession, user_id: int, item_in: CartItemCreate) -> CartItem:
        # Check if item already exists in cart
        query = select(CartItem).options(
            selectinload(CartItem.product).selectinload(Product.category),
            selectinload(CartItem.product).selectinload(Product.images)
        ).where(
            CartItem.user_id == user_id, 
            CartItem.product_id == item_in.product_id
        )
        result = await db.execute(query)
        existing_item = result.scalar_one_or_none()

        if existing_item:
            existing_item.quantity += item_in.quantity
            db.add(existing_item)
            await db.commit()
            await db.refresh(existing_item)
            return existing_item
        
        db_item = CartItem(
            user_id=user_id,
            product_id=item_in.product_id,
            quantity=item_in.quantity
        )
        db.add(db_item)
        await db.commit()
        # Re-fetch with product loaded
        query = select(CartItem).options(
            selectinload(CartItem.product).selectinload(Product.category),
            selectinload(CartItem.product).selectinload(Product.images)
        ).where(CartItem.id == db_item.id)
        result = await db.execute(query)
        return result.scalar_one()

    async def update_cart_item(self, db: AsyncSession, user_id: int, item_id: int, item_in: CartItemUpdate) -> Optional[CartItem]:
        query = select(CartItem).options(
            selectinload(CartItem.product).selectinload(Product.category),
            selectinload(CartItem.product).selectinload(Product.images)
        ).where(CartItem.id == item_id, CartItem.user_id == user_id)
        result = await db.execute(query)
        db_item = result.scalar_one_or_none()
        
        if db_item:
            db_item.quantity = item_in.quantity
            db.add(db_item)
            await db.commit()
            # Safe refetch
            query = select(CartItem).options(
                selectinload(CartItem.product).selectinload(Product.category),
                selectinload(CartItem.product).selectinload(Product.images)
            ).where(CartItem.id == db_item.id)
            result = await db.execute(query)
            return result.scalar_one()
        return db_item

    async def remove_from_cart(self, db: AsyncSession, user_id: int, item_id: int) -> bool:
        query = delete(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0

    async def clear_cart(self, db: AsyncSession, user_id: int) -> None:
        query = delete(CartItem).where(CartItem.user_id == user_id)
        await db.execute(query)
        await db.commit()

cart_service = CartService()
