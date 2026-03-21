from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    mobile: Optional[str] = None
    is_active: Optional[bool] = True
    is_mobile_verified: Optional[bool] = False
    is_email_verified: Optional[bool] = False

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.USER

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    mobile: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class UserAdminUpdate(UserUpdate):
    role: Optional[UserRole] = None
    is_mobile_verified: Optional[bool] = None
    is_email_verified: Optional[bool] = None

class UserInDBBase(UserBase):
    id: int
    role: UserRole = UserRole.USER
    
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass
