from fastapi import APIRouter
from app.core.system_flags import get_system_flags

router = APIRouter()

@router.get("/flags")
async def flags():
    return get_system_flags()
