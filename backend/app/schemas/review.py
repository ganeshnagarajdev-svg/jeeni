from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class ProductReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 stars")
    review_text: Optional[str] = None


class ProductReviewCreate(ProductReviewBase):
    pass


class ProductReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    review_text: Optional[str] = None


class ProductReviewUser(BaseModel):
    id: int
    full_name: Optional[str] = None
    email: str
    
    class Config:
        from_attributes = True


class ProductReview(ProductReviewBase):
    id: int
    product_id: int
    user_id: int
    user: Optional[ProductReviewUser] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

    @property
    def user_name(self) -> str:
        if self.user and self.user.full_name:
            return self.user.full_name
        elif self.user:
            return self.user.email.split('@')[0]
        return "Anonymous"


class ProductReviewWithUserName(BaseModel):
    """Review schema with user_name as a direct field for serialization"""
    id: int
    product_id: int
    user_id: int
    rating: int
    review_text: Optional[str] = None
    user_name: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
