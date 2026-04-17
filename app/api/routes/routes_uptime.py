from fastapi import APIRouter
from app.core.system_uptime import get_uptime

router = APIRouter()

@router.get("/uptime")
async def uptime():
    return get_uptime()
