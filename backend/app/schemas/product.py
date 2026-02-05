from typing import List, Optional
from pydantic import BaseModel, Field

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = None
    is_active: Optional[bool] = None

class Category(CategoryBase):
    id: int
    slug: str
    is_active: bool
    
    class Config:
        from_attributes = True

# Product Image Schemas
class ProductImageBase(BaseModel):
    image_url: str
    is_main: bool = False

class ProductImageCreate(ProductImageBase):
    pass

class ProductImage(ProductImageBase):
    id: int
    product_id: int
    
    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    discounted_price: Optional[float] = None
    stock: int = 0
    is_active: bool = True
    is_featured: bool = False
    category_id: int

class ProductCreate(ProductBase):
    images: List[ProductImageCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discounted_price: Optional[float] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    category_id: Optional[int] = None
    images: Optional[List[ProductImageCreate]] = None

class Product(ProductBase):
    id: int
    slug: str
    category: Optional[Category] = None
    images: List[ProductImage] = Field(default_factory=list)
    
    class Config:
        from_attributes = True
