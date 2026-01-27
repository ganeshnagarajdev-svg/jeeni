from typing import Any, List, Union, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.routers import deps
from app.services.content_service import blog_service, media_service
from app.schemas.content import Blog, BlogCreate, BlogUpdate, Media, MediaCreate
from app.models.user import User

router = APIRouter()

# Blog Endpoints
@router.get("/blogs", response_model=List[Blog])
async def read_blogs(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve blogs.
    """
    return await blog_service.get_multi(db, skip=skip, limit=limit)

@router.get("/blogs/{slug}", response_model=Blog)
async def read_blog(
    slug: str,
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Retrieve blog by slug.
    """
    blog = await blog_service.get_by_slug(db, slug=slug)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.post("/blogs", response_model=Blog)
async def create_blog(
    *,
    db: AsyncSession = Depends(deps.get_db),
    blog_in: BlogCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new blog (Admin only).
    """
    return await blog_service.create(db, obj_in=blog_in, author_id=current_user.id)

@router.put("/blogs/{id}", response_model=Blog)
async def update_blog(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    blog_in: BlogUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update blog (Admin only).
    """
    blog = await blog_service.update(db, id=id, obj_in=blog_in)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.delete("/blogs/{id}", response_model=Blog)
async def delete_blog(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete blog.
    """
    blog = await blog_service.remove(db, id=id)
    if not blog:
         raise HTTPException(status_code=404, detail="Blog not found")
    
    return blog

# Media Endpoints
@router.get("/media", response_model=List[Media])
async def read_media(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve media (gallery).
    """
    return await media_service.get_multi(db, skip=skip, limit=limit)

@router.post("/media", response_model=Media)
async def create_media(
    *,
    db: AsyncSession = Depends(deps.get_db),
    media_in: MediaCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Add new media (Admin only).
    """
    return await media_service.create(db, obj_in=media_in)

@router.delete("/media/{id}", response_model=Media)
async def delete_media(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete media.
    """
    media = await media_service.remove(db, id=id)
    if not media:
         raise HTTPException(status_code=404, detail="Media not found")
    
    return media
