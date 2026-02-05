import asyncio
from app.db.session import AsyncSessionLocal
from app.repositories.user_repository import user_repo
from app.models.user import UserRole
from sqlalchemy.future import select
from app.models.user import User

async def promote_user(email: str):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        if not user:
            print(f"User with email {email} not found.")
            # List all users to help
            users_result = await db.execute(select(User))
            users = users_result.scalars().all()
            print("Current users in database:")
            for u in users:
                print(f"- {u.email} (Role: {u.role}, Superuser: {u.is_superuser})")
            return

        user.role = UserRole.ADMIN
        user.is_superuser = True
        await db.commit()
        print(f"User {email} has been promoted to ADMIN and Superuser.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python promote_user.py <email>")
        # Try a common one or list users
        asyncio.run(promote_user("admin@example.com"))
    else:
        asyncio.run(promote_user(sys.argv[1]))
