from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Career Schemas
class CareerBase(BaseModel):
    title: str
    department: str
    location: str
    description: str
    requirements: Optional[str] = None
    is_active: bool = True

class CareerCreate(CareerBase):
    pass

class CareerUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    is_active: Optional[bool] = None

class Career(CareerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Page Schemas
class PageBase(BaseModel):
    title: str
    slug: str
    content: str
    is_published: bool = True

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    is_published: Optional[bool] = None

class Page(PageBase):
    id: int

    class Config:
        from_attributes = True

# HomeSection Schemas
class HomeSectionBase(BaseModel):
    title: Optional[str] = None
    section_type: str
    configuration: Optional[str] = None
    order: int = 0
    is_active: bool = True

class HomeSectionCreate(HomeSectionBase):
    pass

class HomeSectionUpdate(BaseModel):
    title: Optional[str] = None
    section_type: Optional[str] = None
    configuration: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class HomeSection(HomeSectionBase):
    id: int

    class Config:
        from_attributes = True
