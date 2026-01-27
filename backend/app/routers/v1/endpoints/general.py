from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.routers import deps
from app.services.general_service import career_service, page_service
from app.schemas.general import Career, CareerCreate, CareerUpdate, Page, PageCreate, PageUpdate
from app.models.user import User

router = APIRouter()

# Career Endpoints
@router.get("/careers", response_model=List[Career])
async def read_careers(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve job postings.
    """
    return await career_service.get_multi(db, skip=skip, limit=limit)

@router.get("/careers/{id}", response_model=Career)
async def read_career(
    id: int,
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Retrieve job posting by ID.
    """
    job = await career_service.get(db, id=id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/careers", response_model=Career)
async def create_career(
    *,
    db: AsyncSession = Depends(deps.get_db),
    career_in: CareerCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new job posting (Admin only).
    """
    return await career_service.create(db, obj_in=career_in)

@router.put("/careers/{id}", response_model=Career)
async def update_career(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    career_in: CareerUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update job posting (Admin only).
    """
    job = await career_service.update(db, id=id, obj_in=career_in)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.delete("/careers/{id}", response_model=Career)
async def delete_career(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete career posting.
    """
    job = await career_service.remove(db, id=id)
    if not job:
         raise HTTPException(status_code=404, detail="Job not found")
    
    return job

# Page Endpoints
@router.get("/pages/{slug}", response_model=Page)
async def read_page(
    slug: str,
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Retrieve static page by slug (e.g., 'about-us').
    """
    page = await page_service.get_by_slug(db, slug=slug)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@router.post("/pages", response_model=Page)
async def create_page(
    *,
    db: AsyncSession = Depends(deps.get_db),
    page_in: PageCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new page (Admin only).
    """
    return await page_service.create(db, obj_in=page_in)

@router.put("/pages/{id}", response_model=Page)
async def update_page(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    page_in: PageUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update page (Admin only).
    """
    page = await page_service.update(db, id=id, obj_in=page_in)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page
