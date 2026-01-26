from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.general_repository import career_repo, page_repo
from app.schemas.general import CareerCreate, PageCreate
from app.models.general import Career, Page

class CareerService:
    async def create(self, db: AsyncSession, obj_in: CareerCreate) -> Career:
        return await career_repo.create(db, obj_in=obj_in)

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Career]:
        return await career_repo.get_multi(db, skip=skip, limit=limit)

    async def get(self, db: AsyncSession, id: int) -> Optional[Career]:
        return await career_repo.get(db, id=id)

    async def remove(self, db: AsyncSession, id: int) -> Optional[Career]:
        return await career_repo.remove(db, id=id)

class PageService:
    async def create(self, db: AsyncSession, obj_in: PageCreate) -> Page:
        return await page_repo.create(db, obj_in=obj_in)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Page]:
        return await page_repo.get_by_slug(db, slug=slug)

    async def remove(self, db: AsyncSession, id: int) -> Optional[Page]:
        return await page_repo.remove(db, id=id)

career_service = CareerService()
page_service = PageService()
