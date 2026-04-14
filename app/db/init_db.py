from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.user import get_user_by_email, create_user


async def init_db(db: AsyncSession) -> None:
    # Example: ensure an initial admin user exists
    admin_email = "admin@example.com"
    admin_password = "admin123"

    existing = await get_user_by_email(db, admin_email)
    if not existing:
        await create_user(db, admin_email, admin_password)
