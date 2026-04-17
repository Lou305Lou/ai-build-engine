from fastapi import APIRouter
from app.core.system_profile import get_system_profile

router = APIRouter()

@router.get("/profile")
async def profile():
    return get_system_profile()
