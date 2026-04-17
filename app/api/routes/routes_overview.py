from fastapi import APIRouter
from app.core.system_overview_provider import get_system_overview

router = APIRouter()

@router.get("/overview")
async def overview():
    return get_system_overview()
