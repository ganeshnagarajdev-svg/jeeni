from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.routers import deps
from app.schemas.admin import DashboardStats
from app.models.user import User
from app.models.product import Product
# from app.models.order import Order # Order not implemented yet

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

    # Mock Orders and Revenue until Order module is ready
    total_orders = 0
    total_revenue = 0.0

    return {
        "total_users": total_users or 0,
        "total_products": total_products or 0,
        "total_orders": total_orders,
        "total_revenue": total_revenue
    }
