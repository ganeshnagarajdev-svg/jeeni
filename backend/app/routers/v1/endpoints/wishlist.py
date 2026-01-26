from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.routers import deps
from app.services.wishlist_service import wishlist_service
from app.schemas.wishlist import Wishlist, WishlistCreate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Wishlist])
async def read_wishlist(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve current user's wishlist.
    """
    return await wishlist_service.get_multi_by_user(db=db, user_id=current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=Wishlist)
async def add_to_wishlist(
    *,
    db: AsyncSession = Depends(deps.get_db),
    wishlist_in: WishlistCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Add product to wishlist.
    """
    existing = await wishlist_service.get_by_product_and_user(db, user_id=current_user.id, product_id=wishlist_in.product_id)
    if existing:
        raise HTTPException(status_code=400, detail="Product already in wishlist")
    
    return await wishlist_service.create(db=db, obj_in=wishlist_in, user_id=current_user.id)

@router.delete("/{id}", response_model=Wishlist)
async def remove_from_wishlist(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Remove item from wishlist.
    """
    item = await wishlist_service.get(db=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    if item.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough privileges")
    return await wishlist_service.remove(db=db, id=id)
