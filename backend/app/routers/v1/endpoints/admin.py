from typing import Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.routers import deps
from app.schemas.admin import DashboardStats
from app.schemas.general import ContactMessage # Import Pydantic schema
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderStatus
from app.models.general import Career
from app.models.content import Blog
from app.schemas.user import User as UserSchema, UserUpdate
from app.services.user_service import user_service

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

    # Active Jobs
    jobs_query = select(func.count(Career.id)).where(Career.is_active == True)
    jobs_result = await db.execute(jobs_query)
    active_jobs = jobs_result.scalar()

    # Published Blogs
    blogs_query = select(func.count(Blog.id)).where(Blog.is_published == True)
    blogs_result = await db.execute(blogs_query)
    active_blogs = blogs_result.scalar()

    return {
        "total_users": total_users or 0,
        "total_products": total_products or 0,
        "total_orders": total_orders or 0,
        "total_revenue": total_revenue or 0.0,
        "active_jobs": active_jobs or 0,
        "active_blogs": active_blogs or 0
    }

@router.get("/contacts", response_model=List[ContactMessage])
async def read_contact_messages(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve contact messages (Admin only).
    """
    from app.services.general_service import contact_message_service
    messages = await contact_message_service.get_multi(db, skip=skip, limit=limit)
    return [ContactMessage.model_validate(msg) for msg in messages]

@router.get("/users", response_model=List[UserSchema])
async def read_users(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve users (Admin only).
    """
    return await user_service.get_multi(db, skip=skip, limit=limit)

@router.put("/users/{id}", response_model=UserSchema)
async def update_user(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a user (Admin only).
    """
    user = await user_service.update(db, user_id=id, obj_in=user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/reports/orders")
async def get_order_report(
    db: AsyncSession = Depends(deps.get_db),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get order statistics (Successful vs Cancelled).
    """
    query = select(Order.status, func.count(Order.id).label("count"), func.sum(Order.total_amount).label("total"))
    if start_date:
        query = query.where(Order.created_at >= start_date)
    if end_date:
        query = query.where(Order.created_at <= end_date)
    
    query = query.group_by(Order.status)
    result = await db.execute(query)
    rows = result.all()
    
    return [
        {"status": row.status, "count": row.count, "total_amount": row.total or 0.0}
        for row in rows
    ]


@router.get("/reports/orders")
async def get_order_report(
    db: AsyncSession = Depends(deps.get_db),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get order statistics (Successful vs Cancelled).
    """
    query = select(Order.status, func.count(Order.id).label("count"), func.sum(Order.total_amount).label("total"))
    if start_date:
        query = query.where(Order.created_at >= start_date)
    if end_date:
        query = query.where(Order.created_at <= end_date)
    
    query = query.group_by(Order.status)
    result = await db.execute(query)
    rows = result.all()
    
    return [
        {"status": row.status, "count": row.count, "total_amount": row.total or 0.0}
        for row in rows
    ]

@router.get("/reports/sales")
async def get_sales_report(
    db: AsyncSession = Depends(deps.get_db),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get detailed sales report with GST (Successful orders only).
    """
    query = select(
        Order.id, 
        Order.total_amount, 
        Order.total_gst, 
        Order.created_at,
        User.full_name.label("customer_name")
    ).join(User, Order.user_id == User.id).where(Order.status.in_(["delivered", "shipping"])) # Successful orders
    
    if start_date:
        query = query.where(Order.created_at >= start_date)
    if end_date:
        query = query.where(Order.created_at <= end_date)
        
    result = await db.execute(query)
    rows = result.all()
    
    return [
        {
            "id": row.id,
            "total_amount": row.total_amount,
            "total_gst": row.total_gst,
            "net_amount": row.total_amount - row.total_gst,
            "created_at": row.created_at,
            "customer_name": row.customer_name
        }
        for row in rows
    ]
