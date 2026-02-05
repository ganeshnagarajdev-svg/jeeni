from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.routers import deps
from app.services.review_service import review_service
from app.schemas.review import ProductReviewCreate, ProductReviewUpdate, ProductReviewWithUserName
from app.models.user import User, UserRole

router = APIRouter()


def review_to_dict(review) -> dict:
    """Convert review model to dict with user_name."""
    user_name = "Anonymous"
    if review.user:
        if review.user.full_name:
            user_name = review.user.full_name
        else:
            user_name = review.user.email.split('@')[0]
    
    return {
        "id": review.id,
        "product_id": review.product_id,
        "user_id": review.user_id,
        "rating": review.rating,
        "review_text": review.review_text,
        "user_name": user_name,
        "created_at": review.created_at,
        "updated_at": review.updated_at
    }


@router.post("/products/{product_id}/reviews", response_model=ProductReviewWithUserName)
async def create_review(
    *,
    db: AsyncSession = Depends(deps.get_db),
    product_id: int,
    review_in: ProductReviewCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Submit a review for a product. Users can only submit one review per product.
    """
    try:
        review = await review_service.create_review(
            db=db, 
            product_id=product_id, 
            user_id=current_user.id, 
            obj_in=review_in
        )
        return review_to_dict(review)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/products/{product_id}/reviews", response_model=List[ProductReviewWithUserName])
async def get_product_reviews(
    *,
    db: AsyncSession = Depends(deps.get_db),
    product_id: int,
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """
    Get all reviews for a product.
    """
    reviews = await review_service.get_reviews_by_product(
        db=db, 
        product_id=product_id, 
        skip=skip, 
        limit=limit
    )
    return [review_to_dict(r) for r in reviews]


@router.get("/products/{product_id}/reviews/stats")
async def get_product_review_stats(
    *,
    db: AsyncSession = Depends(deps.get_db),
    product_id: int,
) -> Any:
    """
    Get average rating and review count for a product.
    """
    avg_rating, review_count = await review_service.get_product_rating_stats(db, product_id)
    return {
        "average_rating": round(avg_rating, 2) if avg_rating else None,
        "review_count": review_count
    }


@router.get("/products/{product_id}/reviews/mine", response_model=ProductReviewWithUserName)
async def get_my_review(
    *,
    db: AsyncSession = Depends(deps.get_db),
    product_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get the current user's review for a product.
    """
    review = await review_service.get_user_review_for_product(
        db=db, 
        product_id=product_id, 
        user_id=current_user.id
    )
    if not review:
        raise HTTPException(status_code=404, detail="You haven't reviewed this product yet")
    return review_to_dict(review)


@router.put("/reviews/{review_id}", response_model=ProductReviewWithUserName)
async def update_review(
    *,
    db: AsyncSession = Depends(deps.get_db),
    review_id: int,
    review_in: ProductReviewUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own review.
    """
    try:
        review = await review_service.update_review(
            db=db,
            review_id=review_id,
            user_id=current_user.id,
            obj_in=review_in
        )
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        return review_to_dict(review)
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.delete("/reviews/{review_id}")
async def delete_review(
    *,
    db: AsyncSession = Depends(deps.get_db),
    review_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete own review (or any review if admin).
    """
    is_admin = current_user.is_superuser or current_user.role == UserRole.ADMIN
    try:
        success = await review_service.delete_review(
            db=db,
            review_id=review_id,
            user_id=current_user.id,
            is_admin=is_admin
        )
        if not success:
            raise HTTPException(status_code=404, detail="Review not found")
        return {"message": "Review deleted successfully"}
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
