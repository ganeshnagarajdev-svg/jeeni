from fastapi import APIRouter
from app.routers.v1.endpoints import auth, products, wishlist, content, general, admin, cart, order, reviews

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(products.router, prefix="/shop", tags=["shop"])
api_router.include_router(reviews.router, prefix="/shop", tags=["reviews"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(order.router, prefix="/order", tags=["order"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(general.router, prefix="/general", tags=["general"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

