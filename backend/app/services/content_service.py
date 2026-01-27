from typing import List, Optional, Union, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.content_repository import blog as blog_repo, media as media_repo
from app.schemas.content import BlogCreate, BlogUpdate, MediaCreate
from app.models.content import Blog, Media

class BlogService:
    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Blog]:
        return await blog_repo.get_multi(db, skip=skip, limit=limit)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Blog]:
        return await blog_repo.get_by_slug(db, slug=slug)

    async def create(self, db: AsyncSession, obj_in: BlogCreate, author_id: int) -> Blog:
        return await blog_repo.create(db, obj_in=obj_in, author_id=author_id)

    async def update(self, db: AsyncSession, id: int, obj_in: Union[BlogUpdate, Dict[str, Any]]) -> Optional[Blog]:
        db_obj = await blog_repo.get(db, id=id)
        if db_obj:
            return await blog_repo.update(db, db_obj=db_obj, obj_in=obj_in)
        return None
        
    async def remove(self, db: AsyncSession, id: int) -> Optional[Blog]:
        return await blog_repo.remove(db, id=id)

class MediaService:
    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Media]:
        return await media_repo.get_multi(db, skip=skip, limit=limit)

    async def create(self, db: AsyncSession, obj_in: MediaCreate) -> Media:
        return await media_repo.create(db, obj_in=obj_in)
        
    async def remove(self, db: AsyncSession, id: int) -> Optional[Media]:
        return await media_repo.remove(db, id=id)

blog_service = BlogService()
media_service = MediaService()
