from typing import List, Optional, Union, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.general import Career, Page, HomeSection, ContactMessage
from app.schemas.general import CareerCreate, CareerUpdate, PageCreate, PageUpdate, HomeSectionCreate, HomeSectionUpdate, ContactMessageCreate
from fastapi.encoders import jsonable_encoder

class CareerRepository:
    async def create(self, db: AsyncSession, *, obj_in: CareerCreate) -> Career:
        db_obj = Career(
            title=obj_in.title,
            department=obj_in.department,
            location=obj_in.location,
            description=obj_in.description,
            requirements=obj_in.requirements,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Career]:
        query = select(Career).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    async def get(self, db: AsyncSession, id: int) -> Optional[Career]:
        query = select(Career).filter(Career.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def update(self, db: AsyncSession, *, db_obj: Career, obj_in: Union[CareerUpdate, Dict[str, Any]]) -> Career:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Career]:
        obj = await self.get(db, id=id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

class PageRepository:
    async def create(self, db: AsyncSession, *, obj_in: PageCreate) -> Page:
        db_obj = Page(
            title=obj_in.title,
            slug=obj_in.slug,
            content=obj_in.content,
            is_published=obj_in.is_published
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Page]:
        query = select(Page).filter(Page.slug == slug)
        result = await db.execute(query)
        return result.scalars().first()

    async def get(self, db: AsyncSession, id: int) -> Optional[Page]:
        query = select(Page).filter(Page.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def update(self, db: AsyncSession, *, db_obj: Page, obj_in: Union[PageUpdate, Dict[str, Any]]) -> Page:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[Page]:
        obj = await self.get(db, id=id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

class HomeSectionRepository:
    async def create(self, db: AsyncSession, *, obj_in: HomeSectionCreate) -> HomeSection:
        db_obj = HomeSection(
            title=obj_in.title,
            section_type=obj_in.section_type,
            configuration=obj_in.configuration,
            order=obj_in.order,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[HomeSection]:
        query = select(HomeSection).order_by(HomeSection.order).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_active(self, db: AsyncSession) -> List[HomeSection]:
        query = select(HomeSection).filter(HomeSection.is_active == True).order_by(HomeSection.order)
        result = await db.execute(query)
        return result.scalars().all()

    async def get(self, db: AsyncSession, id: int) -> Optional[HomeSection]:
        query = select(HomeSection).filter(HomeSection.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def update(self, db: AsyncSession, *, db_obj: HomeSection, obj_in: Union[HomeSectionUpdate, Dict[str, Any]]) -> HomeSection:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> Optional[HomeSection]:
        obj = await self.get(db, id=id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

career_repo = CareerRepository()
page_repo = PageRepository()
home_section_repo = HomeSectionRepository()

class ContactMessageRepository:
    async def create(self, db: AsyncSession, *, obj_in: ContactMessageCreate) -> ContactMessage:
        db_obj = ContactMessage(
            name=obj_in.name,
            email=obj_in.email,
            subject=obj_in.subject,
            message=obj_in.message,
            status="new"
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[ContactMessage]:
        query = select(ContactMessage).order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

contact_message_repo = ContactMessageRepository()
