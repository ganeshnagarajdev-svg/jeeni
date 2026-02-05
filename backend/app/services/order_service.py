from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.order import Order, OrderItem, OrderStatus
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderUpdate
from app.services.cart_service import cart_service

class OrderService:
    async def get_user_orders(self, db: AsyncSession, user_id: int) -> List[Order]:
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category),
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images)
        ).where(Order.user_id == user_id).order_by(Order.created_at.desc())
        result = await db.execute(query)
        return result.scalars().all()

    async def get_order(self, db: AsyncSession, order_id: int, user_id: int) -> Optional[Order]:
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category),
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images)
        ).where(Order.id == order_id, Order.user_id == user_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def create_order_from_cart(self, db: AsyncSession, user_id: int, order_in: OrderCreate) -> Optional[Order]:
        # 1. Get Cart Items
        cart_items = await cart_service.get_cart_items(db, user_id=user_id)
        if not cart_items:
            return None
        
        # 2. Calculate Total
        total_amount = sum(item.quantity * item.product.price for item in cart_items)
        
        # 3. Create Order
        db_order = Order(
            user_id=user_id,
            status=OrderStatus.PENDING,
            total_amount=total_amount,
            shipping_address=order_in.shipping_address,
            city=order_in.city,
            state=order_in.state,
            zip_code=order_in.zip_code,
            phone_number=order_in.phone_number,
            payment_status="pending"
        )
        db.add(db_order)
        await db.flush() # Get order ID
        
        # 4. Create Order Items
        for cart_item in cart_items:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price_at_purchase=cart_item.product.price
            )
            db.add(order_item)
        
        # 5. Clear Cart
        await cart_service.clear_cart(db, user_id=user_id)
        
        await db.commit()
        # Re-fetch with items and products loaded
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category),
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images)
        ).where(Order.id == db_order.id)
        result = await db.execute(query)
        return result.scalar_one()

    async def update_order_status(self, db: AsyncSession, order_id: int, status: OrderStatus) -> Optional[Order]:
        query = select(Order).where(Order.id == order_id)
        result = await db.execute(query)
        db_order = result.scalar_one_or_none()
        if db_order:
            db_order.status = status
            db.add(db_order)
            await db.commit()
            await db.refresh(db_order)
        return db_order

order_service = OrderService()
