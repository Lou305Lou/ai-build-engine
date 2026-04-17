from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_session
from app.db.models.user import User
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token
)

router = APIRouter()

# ---------------------------------------------------------
# SCHEMAS
# ---------------------------------------------------------
class RegisterRequest(BaseModel):
    email: str
    password: str


# ---------------------------------------------------------
# REGISTER NEW USER
# ---------------------------------------------------------
@router.post("/register")
async def register_user(
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_session)
):
    try:
        # Check if user already exists
        result = await db.execute(select(User).where(User.email == payload.email))
        existing_user = result.scalars().first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Create new user
        new_user = User(
            email=payload.email,
            hashed_password=get_password_hash(payload.password)
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return {
            "message": "User registered successfully",
            "email": new_user.email
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------
# LOGIN AND GET JWT
# ---------------------------------------------------------
@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_session)
):
    # Find user
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    # Create JWT
    access_token = create_access_token({"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
