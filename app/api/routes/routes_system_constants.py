from fastapi import APIRouter
from app.core.system_constants import get_system_constants

router = APIRouter()

@router.get("/constants")
async def constants():
    return get_system_constants()
