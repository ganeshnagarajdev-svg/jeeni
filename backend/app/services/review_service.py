from typing import List, Optional, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.review import ProductReview
from app.models.user import User
from app.schemas.review import ProductReviewCreate, ProductReviewUpdate


class ReviewService:
    async def create_review(
        self, 
        db: AsyncSession, 
        product_id: int, 
        user_id: int, 
        obj_in: ProductReviewCreate
    ) -> ProductReview:
        """Create a new review. Raises exception if user already reviewed this product."""
        # Check if user already reviewed this product
        existing = await self.get_user_review_for_product(db, product_id, user_id)
        if existing:
            raise ValueError("You have already reviewed this product. Please edit your existing review.")
        
        db_obj = ProductReview(
            product_id=product_id,
            user_id=user_id,
            rating=obj_in.rating,
            review_text=obj_in.review_text
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        # Load user relationship
        result = await db.execute(
            select(ProductReview)
            .options(selectinload(ProductReview.user))
            .where(ProductReview.id == db_obj.id)
        )
        return result.scalar_one()
    
    async def get_user_review_for_product(
        self, 
        db: AsyncSession, 
        product_id: int, 
        user_id: int
    ) -> Optional[ProductReview]:
        """Get a user's review for a specific product."""
        result = await db.execute(
            select(ProductReview)
            .options(selectinload(ProductReview.user))
            .where(
                ProductReview.product_id == product_id,
                ProductReview.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def get_reviews_by_product(
        self, 
        db: AsyncSession, 
        product_id: int, 
        skip: int = 0, 
        limit: int = 50
    ) -> List[ProductReview]:
        """Get all reviews for a product."""
        result = await db.execute(
            select(ProductReview)
            .options(selectinload(ProductReview.user))
            .where(ProductReview.product_id == product_id)
            .order_by(ProductReview.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
    
    async def get_review(self, db: AsyncSession, review_id: int) -> Optional[ProductReview]:
        """Get a single review by ID."""
        result = await db.execute(
            select(ProductReview)
            .options(selectinload(ProductReview.user))
            .where(ProductReview.id == review_id)
        )
        return result.scalar_one_or_none()
    
    async def update_review(
        self, 
        db: AsyncSession, 
        review_id: int, 
        user_id: int, 
        obj_in: ProductReviewUpdate
    ) -> Optional[ProductReview]:
        """Update a review. Only the owner can update."""
        review = await self.get_review(db, review_id)
        if not review:
            return None
        if review.user_id != user_id:
            raise PermissionError("You can only edit your own reviews.")
        
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(review, field, value)
        
        await db.commit()
        await db.refresh(review)
        return review
    
    async def delete_review(
        self, 
        db: AsyncSession, 
        review_id: int, 
        user_id: int, 
        is_admin: bool = False
    ) -> bool:
        """Delete a review. Owner or admin can delete."""
        review = await self.get_review(db, review_id)
        if not review:
            return False
        if review.user_id != user_id and not is_admin:
            raise PermissionError("You can only delete your own reviews.")
        
        await db.delete(review)
        await db.commit()
        return True
    
    async def get_product_rating_stats(
        self, 
        db: AsyncSession, 
        product_id: int
    ) -> Tuple[Optional[float], int]:
        """Get average rating and review count for a product."""
        result = await db.execute(
            select(
                func.avg(ProductReview.rating).label('avg_rating'),
                func.count(ProductReview.id).label('review_count')
            )
            .where(ProductReview.product_id == product_id)
        )
        row = result.one()
        avg_rating = float(row.avg_rating) if row.avg_rating else None
        return avg_rating, row.review_count


review_service = ReviewService()
