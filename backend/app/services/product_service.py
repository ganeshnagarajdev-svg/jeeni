from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.product_repository import product_repo
from app.schemas.product import ProductCreate, CategoryCreate
from app.models.product import Product, Category

class ProductService:
    # Category Operations
    async def create_category(self, db: AsyncSession, obj_in: CategoryCreate) -> Category:
        return await product_repo.create_category(db=db, obj_in=obj_in)

    async def get_categories(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Category]:
        return await product_repo.get_categories(db, skip=skip, limit=limit)

    async def get_category(self, db: AsyncSession, category_id: int) -> Optional[Category]:
        return await product_repo.get_category(db, category_id)

    # Product Operations
    async def create_product(self, db: AsyncSession, obj_in: ProductCreate) -> Product:
        return await product_repo.create_product(db=db, obj_in=obj_in)

    async def get_products(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100, 
        category_id: Optional[int] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sort_by: Optional[str] = None
    ) -> List[Product]:
        return await product_repo.get_products(
            db, 
            skip=skip, 
            limit=limit, 
            category_id=category_id,
            min_price=min_price,
            max_price=max_price,
            sort_by=sort_by
        )

    async def get_product(self, db: AsyncSession, product_id: int) -> Optional[Product]:
        return await product_repo.get_product(db, product_id)

    async def get_product_by_slug(self, db: AsyncSession, slug: str) -> Optional[Product]:
        return await product_repo.get_product_by_slug(db, slug)
        
    async def delete_product(self, db: AsyncSession, product_id: int) -> Optional[Product]:
        return await product_repo.delete_product(db, product_id)

product_service = ProductService()
