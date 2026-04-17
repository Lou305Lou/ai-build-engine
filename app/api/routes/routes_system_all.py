from fastapi import APIRouter
from app.core.system_all import get_system_all

router = APIRouter()

@router.get("/all")
async def all_system():
    return get_system_all()
