from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Blog Schemas
class BlogBase(BaseModel):
    title: str
    content: str
    is_published: bool = True
    image_url: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_published: Optional[bool] = None
    image_url: Optional[str] = None

class Blog(BlogBase):
    id: int
    slug: str
    author_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

# Media Schemas
class MediaBase(BaseModel):
    title: Optional[str] = None
    media_type: str
    url: str
    description: Optional[str] = None

class MediaCreate(MediaBase):
    pass

class MediaUpdate(BaseModel):
    title: Optional[str] = None
    media_type: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None

class Media(MediaBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
