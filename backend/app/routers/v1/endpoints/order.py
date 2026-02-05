from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.routers import deps
from app.services.order_service import order_service
from app.schemas.order import Order, OrderCreate
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
    order = await order_service.get_order(db, order_id=order_id, user_id=current_user.id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=Order)
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
