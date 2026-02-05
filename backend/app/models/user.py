from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, Column, Integer, String, Enum
from app.db.base_class import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, index=True)
    hashed_password = Column(String, nullable=True) # Nullable for SSO users
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    wishlist = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")
    blogs = relationship("Blog", back_populates="author")
    reviews = relationship("ProductReview", back_populates="user", cascade="all, delete-orphan")
