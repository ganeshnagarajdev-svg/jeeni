from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.general import Career, Page
from app.schemas.general import CareerCreate, PageCreate

class CareerRepository:
    async def create(self, db: AsyncSession, *, obj_in: CareerCreate) -> Career:
        db_obj = Career(
            title=obj_in.title,
            department=obj_in.department,
            location=obj_in.location,
            description=obj_in.description,
            requirements=obj_in.requirements,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Career]:
        query = select(Career).filter(Career.is_active == True).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    async def get(self, db: AsyncSession, id: int) -> Optional[Career]:
        query = select(Career).filter(Career.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Career]:
        obj = await self.get(db, id=id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

class PageRepository:
    async def create(self, db: AsyncSession, *, obj_in: PageCreate) -> Page:
        db_obj = Page(
            title=obj_in.title,
            slug=obj_in.slug,
            content=obj_in.content,
            is_published=obj_in.is_published
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Page]:
        query = select(Page).filter(Page.slug == slug)
        result = await db.execute(query)
        return result.scalars().first()

    async def get(self, db: AsyncSession, id: int) -> Optional[Page]:
        query = select(Page).filter(Page.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Page]:
        obj = await self.get(db, id=id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

career_repo = CareerRepository()
page_repo = PageRepository()
