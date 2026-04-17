from fastapi import APIRouter
from app.core.system_modules import get_system_modules

router = APIRouter()

@router.get("/modules")
async def modules():
    return get_system_modules()
