from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.content import Blog, Media
from app.schemas.content import BlogCreate, MediaCreate
from fastapi.encoders import jsonable_encoder
from typing import Union, Dict, Any

class CRUDBlog:
    async def create(self, db: AsyncSession, *, obj_in: BlogCreate, author_id: int) -> Blog:
        db_obj = Blog(
            title=obj_in.title,
            slug=obj_in.title.lower().replace(" ", "-"),
            content=obj_in.content,
            image_url=obj_in.image_url,
            is_published=obj_in.is_published,
            author_id=author_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Blog]:
        query = select(Blog).filter(Blog.is_published == True).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Blog]:
        query = select(Blog).filter(Blog.slug == slug)
        result = await db.execute(query)
        return result.scalars().first()

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Blog]:
        query = select(Blog).filter(Blog.id == id)
        result = await db.execute(query)
        obj = result.scalars().first()
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

class CRUDMedia:
    async def create(self, db: AsyncSession, *, obj_in: MediaCreate) -> Media:
        db_obj = Media(
            title=obj_in.title,
            media_type=obj_in.media_type,
            url=obj_in.url,
            description=obj_in.description
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Media]:
        query = select(Media).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Media]:
        query = select(Media).filter(Media.id == id)
        result = await db.execute(query)
        obj = result.scalars().first()
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj



blog = CRUDBlog()
media = CRUDMedia()

