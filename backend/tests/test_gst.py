import pytest
from app.services.order_service import order_service
from app.models.product import Product
from app.models.order import Order
from app.schemas.order import OrderCreate
from unittest.mock import AsyncMock, MagicMock

@pytest.mark.anyio
async def test_calculate_total_and_gst():
    # Setup
    db = AsyncMock()
    cart_service = AsyncMock()
    user_id = 1
    
    # Mock Products with different GST rates
    p1 = MagicMock(spec=Product)
    p1.id = 1
    p1.price = 100.0
    p1.gst_rate = 18.0
    
    p2 = MagicMock(spec=Product)
    p2.id = 2
    p2.price = 200.0
    p2.gst_rate = 5.0
    
    # Mock Cart Items
    item1 = MagicMock()
    item1.product_id = 1
    item1.product = p1
    item1.quantity = 2
    
    item2 = MagicMock()
    item2.product_id = 2
    item2.product = p2
    item2.quantity = 1
    
    valid_items = [item1, item2]
    
    # Patch cart_service to return mock items
    cart_service.get_cart_items.return_value = valid_items
    
    order_in = OrderCreate(
        shipping_address="Test Address",
        city="Test City",
        state="Test State",
        zip_code="123456",
        phone_number="1234567890"
    )
    
    # We need to patch the internal cart_service of order_service
    from app.services.order_service import cart_service as internal_cart_service
    import app.services.order_service
    original_cart_service = app.services.order_service.cart_service
    app.services.order_service.cart_service = cart_service
    
    try:
        # Execute
        # Note: We need to mock 'Order' and 'OrderItem' if we don't want to hit real DB
        # But for this logic test, we mainly care about the calculations before db.add
        
        # Patch Order/OrderItem to avoid actual instantiation errors if any, 
        # but SQLAlchemy models usually work fine with mocks if not committed.
        
        order = await order_service.create_order_from_cart(db, user_id=user_id, order_in=order_in)
        
        # Verify
        # Total = (100*2) + (200*1) = 200 + 200 = 400 (Base)
        # GST = (100*2 * 0.18) + (200*1 * 0.05) = 36 + 10 = 46
        # Total including GST = 400 + 46 = 446
        
        # Since we used the real Order class (or mock), let's check what was passed to db.add
        # The first call to db.add is the Order object
        added_order = db.add.call_args_list[0][0][0]
        assert added_order.total_amount == 446.0
        assert added_order.total_gst == 46.0
        
        # Check OrderItems
        # Next two calls to db.add should be OrderItems
        item_added_1 = db.add.call_args_list[1][0][0]
        item_added_2 = db.add.call_args_list[2][0][0]
        
        # Item 1: (price 100, gst_rate 18, gst_amount 36)
        # Item 2: (price 200, gst_rate 5, gst_amount 10)
        
        # Order of items depends on valid_items list
        assert item_added_1.price_at_purchase == 100.0
        assert item_added_1.gst_rate_at_purchase == 18.0
        assert item_added_1.gst_amount_at_purchase == 36.0
        
        assert item_added_2.price_at_purchase == 200.0
        assert item_added_2.gst_rate_at_purchase == 5.0
        assert item_added_2.gst_amount_at_purchase == 10.0
        
    finally:
        # Restore
        app.services.order_service.cart_service = original_cart_service
