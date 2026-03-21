from typing import List, Optional
from pydantic import BaseModel
from app.schemas.product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: int
    user_id: int
    product: Product
    
    class Config:
        from_attributes = True

class Cart(BaseModel):
    items: List[CartItem]
    total_items: int
    total_price: float
    total_gst: float = 0.0
    grand_total: float = 0.0
    
    class Config:
        from_attributes = True
