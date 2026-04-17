from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_session
from app.db.models.user import User

# -------------------------------------------------------------------
# PASSWORD HASHING (ARGON2 — FIXES BCRYPT BUG)
# -------------------------------------------------------------------

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Backwards compatibility
hash_password = get_password_hash

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# -------------------------------------------------------------------
# JWT CONFIG
# -------------------------------------------------------------------

SECRET_KEY = "CHANGE_THIS_TO_A_REAL_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# -------------------------------------------------------------------
# JWT CREATION
# -------------------------------------------------------------------

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# -------------------------------------------------------------------
# CURRENT USER RESOLUTION
# -------------------------------------------------------------------

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    return user
