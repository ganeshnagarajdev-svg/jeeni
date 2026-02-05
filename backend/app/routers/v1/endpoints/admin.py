from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.routers import deps
from app.schemas.admin import DashboardStats
from app.models.user import User
from app.models.product import Product
from app.models.order import Order

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get dashboard statistics (Admin only).
    """
    # Count Users
    user_query = select(func.count(User.id))
    user_count = await db.execute(user_query)
    total_users = user_count.scalar()

    # Count Products
    product_query = select(func.count(Product.id))
    product_count = await db.execute(product_query)
    total_products = product_count.scalar()

    # Count Orders
    order_query = select(func.count(Order.id))
    order_count = await db.execute(order_query)
    total_orders = order_count.scalar()

    # Total Revenue
    revenue_query = select(func.sum(Order.total_amount))
    revenue_result = await db.execute(revenue_query)
    total_revenue = revenue_result.scalar()

    return {
        "total_users": total_users or 0,
        "total_products": total_products or 0,
        "total_orders": total_orders or 0,
        "total_revenue": total_revenue or 0.0
    }
