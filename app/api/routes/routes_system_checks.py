from fastapi import APIRouter
from app.core.system_checks import get_system_checks

router = APIRouter()

@router.get("/checks")
async def checks():
    return get_system_checks()
