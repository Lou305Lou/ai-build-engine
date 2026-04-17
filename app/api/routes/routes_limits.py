from fastapi import APIRouter
from app.core.system_limits import get_system_limits

router = APIRouter()

@router.get("/limits")
async def limits():
    return get_system_limits()
