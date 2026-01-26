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

class Page(PageBase):
    id: int

    class Config:
        from_attributes = True
