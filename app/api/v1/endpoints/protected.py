from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/me", summary="Return current authenticated user")
async def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "id": current_user.id
    }

@router.get("/admin", summary="Admin-only data")
async def read_admin_data(current_user: User = Depends(get_current_user)):
    return {"message": "Admin access granted"}
