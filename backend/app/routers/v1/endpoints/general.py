from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.routers import deps
from app.services.general_service import career_service, page_service, home_section_service, contact_message_service
from app.schemas.general import (
    Career, CareerCreate, CareerUpdate, 
    Page, PageCreate, PageUpdate,
    HomeSection, HomeSectionCreate, HomeSectionUpdate,
    ContactMessage, ContactMessageCreate
)
from app.models.user import User

router = APIRouter()


# Contact Endpoints
@router.post("/contact", response_model=ContactMessage)
async def create_contact_message(
    *,
    db: AsyncSession = Depends(deps.get_db),
    contact_in: ContactMessageCreate,
) -> Any:
    """
    Submit a contact message.
    """
    return await contact_message_service.create(db, obj_in=contact_in)

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

# Home Page Endpoints
@router.get("/home-layout", response_model=List[HomeSection])
async def read_home_layout(
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Retrieve active home page layout.
    """
    return await home_section_service.get_active(db)

@router.get("/home-sections", response_model=List[HomeSection])
async def read_home_sections(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve all home page sections (Admin only).
    """
    return await home_section_service.get_multi(db, skip=skip, limit=limit)

@router.post("/home-sections", response_model=HomeSection)
async def create_home_section(
    *,
    db: AsyncSession = Depends(deps.get_db),
    section_in: HomeSectionCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new home page section (Admin only).
    """
    return await home_section_service.create(db, obj_in=section_in)

@router.put("/home-sections/{id}", response_model=HomeSection)
async def update_home_section(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    section_in: HomeSectionUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update home page section (Admin only).
    """
    section = await home_section_service.update(db, id=id, obj_in=section_in)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section

@router.delete("/home-sections/{id}", response_model=HomeSection)
async def delete_home_section(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete home page section (Admin only).
    """
    section = await home_section_service.remove(db, id=id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section
