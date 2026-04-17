from fastapi import APIRouter
from app.core.system_ping import get_ping

router = APIRouter()

@router.get("/ping")
async def ping():
    return get_ping()
