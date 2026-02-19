from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.base_class import Base

class Career(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    department = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Page(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    is_published = Column(Boolean, default=True)

class HomeSection(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    section_type = Column(String, nullable=False) # 'hero', 'features', 'categories', 'product_grid', 'cta'
    configuration = Column(Text, nullable=True)   # Store JSON configuration
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class ContactMessage(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, index=True, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String, default="new") # new, read, replied
    created_at = Column(DateTime(timezone=True), server_default=func.now())
