from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.routers import deps
from app.services.product_service import product_service

from app.schemas.product import Product, ProductCreate, Category, CategoryCreate
from app.models.user import User

router = APIRouter()

# Category Endpoints
@router.post("/categories", response_model=Category)
async def create_category(
    *,
    db: AsyncSession = Depends(deps.get_db),
    category_in: CategoryCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new category (Admin only).
    """
    return await product_service.create_category(db=db, obj_in=category_in)

@router.get("/categories", response_model=List[Category])
async def read_categories(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve categories.
    """
    return await product_service.get_categories(db, skip=skip, limit=limit)

# Product Endpoints
@router.post("/products", response_model=Product)
async def create_product(
    *,
    db: AsyncSession = Depends(deps.get_db),
    product_in: ProductCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new product (Admin only).
    """
    return await product_service.create_product(db=db, obj_in=product_in)

@router.get("/products", response_model=List[Product])
async def read_products(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = None,
) -> Any:
    """
    Retrieve products with filters.
    """
    return await product_service.get_products(
        db, 
        skip=skip, 
        limit=limit, 
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by
    )

@router.get("/products/{slug}", response_model=Product)
async def read_product(
    *,
    db: AsyncSession = Depends(deps.get_db),
    slug: str,
) -> Any:
    """
    Get product by slug.
    """
    product = await product_service.get_product_by_slug(db, slug=slug)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/products/{id}", response_model=Product)
async def delete_product(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a product.
    """
    product = await product_service.delete_product(db, product_id=id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product
