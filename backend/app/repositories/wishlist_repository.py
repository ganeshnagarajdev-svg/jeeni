from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.wishlist import Wishlist
from app.schemas.wishlist import WishlistCreate

class WishlistRepository:
    async def create(self, db: AsyncSession, *, obj_in: WishlistCreate, user_id: int) -> Wishlist:
        db_obj = Wishlist(
            user_id=user_id,
            product_id=obj_in.product_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return await self.get(db, id=db_obj.id)

    async def get_multi_by_user(self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> List[Wishlist]:
        query = select(Wishlist).options(selectinload(Wishlist.product).selectinload("images")).filter(Wishlist.user_id == user_id).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get(self, db: AsyncSession, id: int) -> Optional[Wishlist]:
        query = select(Wishlist).options(selectinload(Wishlist.product).selectinload("images")).filter(Wishlist.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_product_and_user(self, db: AsyncSession, user_id: int, product_id: int) -> Optional[Wishlist]:
        query = select(Wishlist).filter(Wishlist.user_id == user_id, Wishlist.product_id == product_id)
        result = await db.execute(query)
        return result.scalars().first()

    async def remove(self, db: AsyncSession, *, id: int) -> Wishlist:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

wishlist_repo = WishlistRepository()
