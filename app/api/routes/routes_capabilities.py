from fastapi import APIRouter
from app.core.system_capabilities import get_system_capabilities

router = APIRouter()

@router.get("/capabilities")
async def capabilities():
    return get_system_capabilities()
