from fastapi import APIRouter
from app.core.system_debug_snapshot import get_debug_snapshot

router = APIRouter()

@router.get("/debug")
async def debug_snapshot():
    return get_debug_snapshot()
