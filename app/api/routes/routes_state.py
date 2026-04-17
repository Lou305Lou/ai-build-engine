from fastapi import APIRouter
from app.core.system_state import get_system_state

router = APIRouter()

@router.get("/state")
async def state():
    return get_system_state()
