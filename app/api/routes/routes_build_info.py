from fastapi import APIRouter
from app.core.system_build_info import get_build_info

router = APIRouter()

@router.get("/build")
async def build():
    return get_build_info()
