from fastapi import HTTPException
from jose import jwt, JWTError
from app.core.config import settings

def verify_refresh_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
