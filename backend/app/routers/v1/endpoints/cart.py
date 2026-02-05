from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.routers import deps
from app.services.cart_service import cart_service
from app.schemas.cart import Cart, CartItem, CartItemCreate, CartItemUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=Cart)
async def read_cart(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve current user's cart.
    """
    items = await cart_service.get_cart_items(db, user_id=current_user.id)
    total_items = sum(item.quantity for item in items)
    total_price = sum(item.quantity * item.product.price for item in items)
    
    return {
        "items": items,
        "total_items": total_items,
        "total_price": total_price
    }

@router.post("/", response_model=CartItem)
async def add_to_cart(
    *,
    db: AsyncSession = Depends(deps.get_db),
    item_in: CartItemCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Add product to cart or update quantity if already exists.
    """
    return await cart_service.add_to_cart(db, user_id=current_user.id, item_in=item_in)

@router.put("/{item_id}", response_model=CartItem)
async def update_cart_item(
    *,
    db: AsyncSession = Depends(deps.get_db),
    item_id: int,
    item_in: CartItemUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update cart item quantity.
    """
    item = await cart_service.update_cart_item(db, user_id=current_user.id, item_id=item_id, item_in=item_in)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return item

@router.delete("/{item_id}")
async def remove_from_cart(
    *,
    db: AsyncSession = Depends(deps.get_db),
    item_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Remove item from cart.
    """
    success = await cart_service.remove_from_cart(db, user_id=current_user.id, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@router.delete("/")
async def clear_cart(
    *,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Clear all items from cart.
    """
    await cart_service.clear_cart(db, user_id=current_user.id)
    return {"message": "Cart cleared"}
