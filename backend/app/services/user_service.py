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

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        return await user_repo.create(db, obj_in=obj_in)

    async def authenticate(self, db: AsyncSession, *, email: str, password: str) -> Optional[User]:
        return await user_repo.authenticate(db, email=email, password=password)

user_service = UserService()
