from typing import List, Optional, Union, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.content import Blog, Media
from app.schemas.content import BlogCreate, BlogUpdate, MediaCreate
from fastapi.encoders import jsonable_encoder

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
        query = select(Blog).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Blog]:
        query = select(Blog).filter(Blog.slug == slug)
        result = await db.execute(query)
        return result.scalars().first()

    async def get(self, db: AsyncSession, id: int) -> Optional[Blog]:
        query = select(Blog).filter(Blog.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def update(self, db: AsyncSession, *, db_obj: Blog, obj_in: Union[BlogUpdate, Dict[str, Any]]) -> Blog:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        if "title" in update_data:
             db_obj.slug = update_data["title"].lower().replace(" ", "-")
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Blog]:
        obj = await self.get(db, id=id)
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

    async def get(self, db: AsyncSession, id: int) -> Optional[Media]:
        query = select(Media).filter(Media.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_type(self, db: AsyncSession, media_type: str, skip: int = 0, limit: int = 100) -> List[Media]:
        query = select(Media).filter(Media.media_type == media_type).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def update(self, db: AsyncSession, *, db_obj: Media, obj_in: Union[Dict[str, Any], Any]) -> Media:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Media]:
        obj = await self.get(db, id=id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

blog = CRUDBlog()
media = CRUDMedia()
