from typing import List, Optional, Union, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.general_repository import career_repo, page_repo, home_section_repo, contact_message_repo
from app.schemas.general import CareerCreate, CareerUpdate, PageCreate, PageUpdate, HomeSectionCreate, HomeSectionUpdate, ContactMessageCreate
from app.models.general import Career, Page, HomeSection, ContactMessage

class CareerService:
    async def create(self, db: AsyncSession, obj_in: CareerCreate) -> Career:
        return await career_repo.create(db, obj_in=obj_in)

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Career]:
        return await career_repo.get_multi(db, skip=skip, limit=limit)

    async def get(self, db: AsyncSession, id: int) -> Optional[Career]:
        return await career_repo.get(db, id=id)

    async def update(self, db: AsyncSession, id: int, obj_in: Union[CareerUpdate, Dict[str, Any]]) -> Optional[Career]:
        db_obj = await career_repo.get(db, id=id)
        if db_obj:
            return await career_repo.update(db, db_obj=db_obj, obj_in=obj_in)
        return None

    async def remove(self, db: AsyncSession, id: int) -> Optional[Career]:
        return await career_repo.remove(db, id=id)

class PageService:
    async def create(self, db: AsyncSession, obj_in: PageCreate) -> Page:
        return await page_repo.create(db, obj_in=obj_in)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Page]:
        return await page_repo.get_by_slug(db, slug=slug)

    async def update(self, db: AsyncSession, id: int, obj_in: Union[PageUpdate, Dict[str, Any]]) -> Optional[Page]:
        db_obj = await page_repo.get(db, id=id)
        if db_obj:
            return await page_repo.update(db, db_obj=db_obj, obj_in=obj_in)
        return None

    async def remove(self, db: AsyncSession, id: int) -> Optional[Page]:
        return await page_repo.remove(db, id=id)

class HomeSectionService:
    async def create(self, db: AsyncSession, obj_in: HomeSectionCreate) -> HomeSection:
        return await home_section_repo.create(db, obj_in=obj_in)

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[HomeSection]:
        return await home_section_repo.get_multi(db, skip=skip, limit=limit)

    async def get_active(self, db: AsyncSession) -> List[HomeSection]:
        return await home_section_repo.get_active(db)

    async def get(self, db: AsyncSession, id: int) -> Optional[HomeSection]:
        return await home_section_repo.get(db, id=id)

    async def update(self, db: AsyncSession, id: int, obj_in: Union[HomeSectionUpdate, Dict[str, Any]]) -> Optional[HomeSection]:
        db_obj = await home_section_repo.get(db, id=id)
        if db_obj:
            return await home_section_repo.update(db, db_obj=db_obj, obj_in=obj_in)
        return None

    async def remove(self, db: AsyncSession, id: int) -> Optional[HomeSection]:
        return await home_section_repo.remove(db, id=id)

career_service = CareerService()
page_service = PageService()
home_section_service = HomeSectionService()

class ContactMessageService:
    async def create(self, db: AsyncSession, obj_in: ContactMessageCreate) -> ContactMessage:
        return await contact_message_repo.create(db, obj_in=obj_in)

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[ContactMessage]:
        return await contact_message_repo.get_multi(db, skip=skip, limit=limit)

contact_message_service = ContactMessageService()
