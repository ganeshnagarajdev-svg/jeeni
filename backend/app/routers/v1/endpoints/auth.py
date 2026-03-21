from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.ratelimit import SafeRateLimiter as RateLimiter

from app.routers import deps
from app.core import security
from app.core.config import settings
from app.services.user_service import user_service
from app.schemas.user import User as UserSchema, UserCreate

router = APIRouter()

@router.post("/login/access-token", dependencies=[Depends(RateLimiter(times=5, seconds=60))])
async def login_access_token(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await user_service.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(
            status_code=400, 
            detail="Your account is deactivated or blocked. Please contact the administrator."
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/signup", response_model=UserSchema, status_code=201, dependencies=[Depends(RateLimiter(times=5, seconds=60))])
async def create_user_signup(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in
    """
    user = await user_service.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    if user_in.mobile:
        user_by_mobile = await user_service.get_by_mobile(db, mobile=user_in.mobile)
        if user_by_mobile:
            raise HTTPException(
                status_code=400,
                detail="The user with this mobile number already exists in the system",
            )

    from app.models.user import UserRole
    import random
    import string

    user_in.role = UserRole.USER
    # Generate mock OTPs
    mobile_otp = ''.join(random.choices(string.digits, k=6))
    email_otp = ''.join(random.choices(string.digits, k=6))
    
    try:
        user = await user_service.create(db, obj_in=user_in)
        # Update with OTPs (in a real app, send them via SMS/Email)
        user.mobile_otp = mobile_otp
        user.email_otp = email_otp
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        print(f"###### SIGNUP OTP for {user.email}: Mobile={mobile_otp}, Email={email_otp}")
        
    except Exception as e:
        print(f"###### ERROR CREATING USER: {e}")
        import traceback
        traceback.print_exc()
        raise e
    return user

@router.post("/verify-otp", response_model=UserSchema)
async def verify_otp(
    *,
    db: AsyncSession = Depends(deps.get_db),
    email: str,
    otp: str,
    type: str # "email" or "mobile"
) -> Any:
    user = await user_service.get_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if type == "email":
        if user.email_otp == otp:
            user.is_email_verified = True
            user.email_otp = None
        else:
            raise HTTPException(status_code=400, detail="Invalid email OTP")
    elif type == "mobile":
        if user.mobile_otp == otp:
            user.is_mobile_verified = True
            user.mobile_otp = None
        else:
            raise HTTPException(status_code=400, detail="Invalid mobile OTP")
    else:
        raise HTTPException(status_code=400, detail="Invalid verification type")
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/resend-otp")
async def resend_otp(
    *,
    db: AsyncSession = Depends(deps.get_db),
    email: str,
    type: str
) -> Any:
    user = await user_service.get_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    import random
    import string
    new_otp = ''.join(random.choices(string.digits, k=6))
    
    if type == "email":
        user.email_otp = new_otp
    elif type == "mobile":
        user.mobile_otp = new_otp
    else:
        raise HTTPException(status_code=400, detail="Invalid verification type")
    
    db.add(user)
    await db.commit()
    print(f"###### RESENT OTP for {user.email}: {type}={new_otp}")
    return {"message": f"{type.capitalize()} OTP resent successfully"}

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: UserSchema = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
