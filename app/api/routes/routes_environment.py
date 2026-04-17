from fastapi import APIRouter
from app.core.system_environment import get_system_environment

router = APIRouter()

@router.get("/environment")
async def environment():
    return get_system_environment()
