from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.wishlist_repository import wishlist_repo
from app.schemas.wishlist import WishlistCreate
from app.models.wishlist import Wishlist

class WishlistService:
    async def create(self, db: AsyncSession, obj_in: WishlistCreate, user_id: int) -> Wishlist:
        return await wishlist_repo.create(db, obj_in=obj_in, user_id=user_id)

    async def get_multi_by_user(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> List[Wishlist]:
        return await wishlist_repo.get_multi_by_user(db, user_id=user_id, skip=skip, limit=limit)

    async def get(self, db: AsyncSession, id: int) -> Optional[Wishlist]:
        return await wishlist_repo.get(db, id=id)

    async def get_by_product_and_user(self, db: AsyncSession, user_id: int, product_id: int) -> Optional[Wishlist]:
        return await wishlist_repo.get_by_product_and_user(db, user_id=user_id, product_id=product_id)

    async def remove(self, db: AsyncSession, id: int) -> Wishlist:
        return await wishlist_repo.remove(db, id=id)

wishlist_service = WishlistService()
