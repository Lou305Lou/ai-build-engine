from fastapi import APIRouter
from app.core.system_paths import get_system_paths

router = APIRouter()

@router.get("/paths")
async def paths():
    return get_system_paths()
