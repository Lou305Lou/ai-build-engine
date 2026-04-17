from fastapi import APIRouter
from app.core.system_modes import get_system_modes

router = APIRouter()

@router.get("/modes")
async def modes():
    return get_system_modes()
