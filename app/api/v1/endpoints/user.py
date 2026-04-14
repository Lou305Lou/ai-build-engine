from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.user import UserCreate, UserRead
from app.crud.user import create_user, get_user_by_email

router = APIRouter()


@router.post("/", response_model=UserRead)
async def create_new_user(user_in: UserCreate, db: AsyncSession = Depends(get_session)):
    existing = await get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = await create_user(db, user_in.email, user_in.password)
    return user


@router.get("/{email}", response_model=UserRead)
async def read_user(email: str, db: AsyncSession = Depends(get_session)):
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
