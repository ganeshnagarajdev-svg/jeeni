from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import user_repo
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User

class UserService:
    async def get(self, db: AsyncSession, id: int) -> Optional[User]:
        return await user_repo.get(db, id=id)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        return await user_repo.get_by_email(db, email=email)

    async def get_by_mobile(self, db: AsyncSession, mobile: str) -> Optional[User]:
        return await user_repo.get_by_mobile(db, mobile=mobile)

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        return await user_repo.create(db, obj_in=obj_in)

    async def get_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[User]:
        return await user_repo.get_multi(db, skip=skip, limit=limit)

    async def update(self, db: AsyncSession, *, user_id: int, obj_in: any) -> Optional[User]:
        db_obj = await user_repo.get(db, id=user_id)
        if db_obj:
            return await user_repo.update(db, db_obj=db_obj, obj_in=obj_in)
        return None

    async def authenticate(self, db: AsyncSession, *, email: str, password: str) -> Optional[User]:
        return await user_repo.authenticate(db, email=email, password=password)

user_service = UserService()
