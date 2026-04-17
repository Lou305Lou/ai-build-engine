from fastapi import APIRouter
from app.core.system_overrides import get_system_overrides

router = APIRouter()

@router.get("/overrides")
async def overrides():
    return get_system_overrides()
