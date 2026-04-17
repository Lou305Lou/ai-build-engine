from fastapi import APIRouter
from app.core.system_runtime_info import get_runtime_info

router = APIRouter()

@router.get("/runtime")
async def runtime():
    return get_runtime_info()
