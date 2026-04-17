from fastapi import APIRouter
from app.core.system_components import get_system_components

router = APIRouter()

@router.get("/components")
async def components():
    return get_system_components()
