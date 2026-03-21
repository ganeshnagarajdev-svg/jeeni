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

    async def get_all_orders(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Order]:
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category),
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images)
        ).order_by(Order.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_order(self, db: AsyncSession, order_id: int, user_id: Optional[int] = None) -> Optional[Order]:
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category),
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images)
        ).where(Order.id == order_id)
        
        if user_id:
            query = query.where(Order.user_id == user_id)
            
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def create_order_from_cart(self, db: AsyncSession, user_id: int, order_in: OrderCreate) -> Optional[Order]:
        # 1. Get Cart Items
        cart_items = await cart_service.get_cart_items(db, user_id=user_id)
        if not cart_items:
            return None
        
        # Filter out items where product is None (deleted)
        valid_items = [item for item in cart_items if item.product]
        if not valid_items:
            return None
            
        # 2. Calculate Total and GST
        total_amount = 0.0
        total_gst = 0.0
        
        order_items_data = []
        for item in valid_items:
            item_price = item.product.price
            item_gst_rate = getattr(item.product, 'gst_rate', 0.0)
            item_gst_amount = (item_price * item_gst_rate / 100.0) * item.quantity
            
            total_amount += (item_price * item.quantity)
            total_gst += item_gst_amount
            
            order_items_data.append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item_price,
                "gst_rate": item_gst_rate,
                "gst_amount": item_gst_amount / item.quantity # unit gst
            })

        # 3. Create Order
        db_order = Order(
            user_id=user_id,
            status=OrderStatus.PENDING,
            total_amount=total_amount + total_gst, # Total including GST
            total_gst=total_gst,
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
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                price_at_purchase=item_data["price"],
                gst_rate_at_purchase=item_data["gst_rate"],
                gst_amount_at_purchase=item_data["gst_amount"] * item_data["quantity"]
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
            
            # Re-fetch with items loaded to prevent MisssingGreenlet error during serialization
            query = select(Order).options(
                selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category),
                selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images)
            ).where(Order.id == db_order.id)
            result = await db.execute(query)
            return result.scalar_one()
        return db_order

    async def cancel_order(self, db: AsyncSession, order_id: int, user_id: int) -> Optional[Order]:
        query = select(Order).where(Order.id == order_id, Order.user_id == user_id)
        result = await db.execute(query)
        db_order = result.scalar_one_or_none()
        
        if db_order and db_order.status == OrderStatus.PENDING:
            db_order.status = OrderStatus.CANCELLED
            db.add(db_order)
            await db.commit()
            await db.refresh(db_order)
            return db_order
        return None

order_service = OrderService()
