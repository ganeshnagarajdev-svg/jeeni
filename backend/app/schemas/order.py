from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.schemas.product import Product
from app.models.order import OrderStatus

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    price_at_purchase: float
    product: Product
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_address: str
    city: str
    state: str
    zip_code: str
    phone_number: str

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[str] = None

class Order(OrderBase):
    id: int
    user_id: int
    status: OrderStatus
    total_amount: float
    payment_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItem]
    
    class Config:
        from_attributes = True
