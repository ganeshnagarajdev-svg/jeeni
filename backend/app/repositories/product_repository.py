from typing import List, Optional, Union, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.product import Product, Category, ProductImage
from app.schemas.product import ProductCreate, ProductUpdate, CategoryCreate, CategoryUpdate
from fastapi.encoders import jsonable_encoder

class ProductRepository:
    # Category Operations
    async def create_category(self, db: AsyncSession, *, obj_in: CategoryCreate) -> Category:
        db_obj = Category(
            name=obj_in.name,
            slug=obj_in.name.lower().replace(" ", "-"),
            description=obj_in.description
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_categories(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Category]:
        result = await db.execute(select(Category).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_category(self, db: AsyncSession, category_id: int) -> Optional[Category]:
        result = await db.execute(select(Category).filter(Category.id == category_id))
        return result.scalars().first()

    # Product Operations
    async def create_product(self, db: AsyncSession, *, obj_in: ProductCreate) -> Product:
        db_obj = Product(
            name=obj_in.name,
            slug=obj_in.name.lower().replace(" ", "-"),
            description=obj_in.description,
            price=obj_in.price,
            discounted_price=obj_in.discounted_price,
            stock=obj_in.stock,
            is_active=obj_in.is_active,
            is_featured=obj_in.is_featured,
            category_id=obj_in.category_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        # Add Images
        if obj_in.images:
            for img in obj_in.images:
                db_img = ProductImage(
                    product_id=db_obj.id,
                    image_url=img.image_url,
                    is_main=img.is_main
                )
                db.add(db_img)
            await db.commit()
            await db.refresh(db_obj)
            
        # Re-fetch with relationships
        return await self.get_product(db, db_obj.id)

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
        query = select(Product).options(selectinload(Product.images), selectinload(Product.category))
        
        if category_id:
            query = query.filter(Product.category_id == category_id)
        
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
            
        if sort_by == 'newest':
            query = query.order_by(Product.id.desc())
        elif sort_by == 'price_low':
            query = query.order_by(Product.price.asc())
        elif sort_by == 'price_high':
            query = query.order_by(Product.price.desc())
            
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_product(self, db: AsyncSession, product_id: int) -> Optional[Product]:
        query = select(Product).options(selectinload(Product.images), selectinload(Product.category)).filter(Product.id == product_id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_product_by_slug(self, db: AsyncSession, slug: str) -> Optional[Product]:
        query = select(Product).options(selectinload(Product.images), selectinload(Product.category)).filter(Product.slug == slug)
        result = await db.execute(query)
        return result.scalars().first()

    async def update_product(self, db: AsyncSession, *, db_obj: Product, obj_in: Union[ProductUpdate, Dict[str, Any]]) -> Product:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        if "name" in update_data:
             db_obj.slug = update_data["name"].lower().replace(" ", "-")
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete_product(self, db: AsyncSession, product_id: int) -> Optional[Product]:
        product = await self.get_product(db, product_id)
        if product:
            await db.delete(product)
            await db.commit()
        return product

product_repo = ProductRepository()
