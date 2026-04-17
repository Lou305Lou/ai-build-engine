from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_session
from app.db.models.user import User
from app.core.security import get_current_user

router = APIRouter()


# ---------------------------------------------------------
# GET CURRENT USER
# ---------------------------------------------------------
@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email
    }


# ---------------------------------------------------------
# UPDATE USER EMAIL
# ---------------------------------------------------------
@router.put("/me")
async def update_current_user(
    payload: dict,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    new_email = payload.get("email")

    if not new_email:
        raise HTTPException(status_code=400, detail="Email is required")

    # Check if email already exists
    result = await db.execute(select(User).where(User.email == new_email))
    existing = result.scalars().first()

    if existing and existing.id != current_user.id:
        raise HTTPException(status_code=400, detail="Email already in use")

    current_user.email = new_email
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return {
        "message": "User updated successfully",
        "id": current_user.id,
        "email": current_user.email
    }
