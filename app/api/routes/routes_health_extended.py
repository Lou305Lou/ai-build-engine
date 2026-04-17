from fastapi import APIRouter
from app.core.system_health_extended import get_extended_health

router = APIRouter()

@router.get("/extended")
async def extended():
    return get_extended_health()
