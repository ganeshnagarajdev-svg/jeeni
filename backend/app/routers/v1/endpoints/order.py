from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.ratelimit import SafeRateLimiter as RateLimiter

from app.routers import deps
from app.services.order_service import order_service
from app.schemas.order import Order, OrderCreate, OrderUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Order])
async def read_orders(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve current user's order history.
    """
    return await order_service.get_user_orders(db, user_id=current_user.id)

@router.get("/{order_id}", response_model=Order)
async def read_order(
    order_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get specific order details.
    """
    user_id = current_user.id
    if current_user.is_superuser or current_user.role == "admin":
        user_id = None
        
    order = await order_service.get_order(db, order_id=order_id, user_id=user_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=Order, dependencies=[Depends(RateLimiter(times=2, seconds=60))])
async def create_order(
    *,
    db: AsyncSession = Depends(deps.get_db),
    order_in: OrderCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new order from current cart (Checkout).
    """
    order = await order_service.create_order_from_cart(db, user_id=current_user.id, order_in=order_in)
    if not order:
        raise HTTPException(status_code=400, detail="Cart is empty or could not create order")
    return order

@router.get("/admin/all", response_model=List[Order])
async def read_all_orders(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve all orders (Admin only).
    """
    return await order_service.get_all_orders(db, skip=skip, limit=limit)

@router.patch("/{order_id}/status", response_model=Order)
async def update_order_status(
    order_id: int,
    status_in: OrderUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update order status (Admin only).
    """
    if not status_in.status:
        raise HTTPException(status_code=400, detail="Status is required")
        
    order = await order_service.update_order_status(db, order_id=order_id, status=status_in.status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/{order_id}/cancel", response_model=Order)
async def cancel_order(
    order_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Cancel an order (User only, if pending).
    """
    order = await order_service.get_order(db, order_id=order_id, user_id=current_user.id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.status != "pending":
         raise HTTPException(status_code=400, detail="Cannot cancel order that is not pending")

    cancelled_order = await order_service.cancel_order(db, order_id=order_id, user_id=current_user.id)
    return cancelled_order
