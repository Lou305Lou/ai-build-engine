from fastapi import APIRouter
from app.core.system_boot_info import get_boot_info

router = APIRouter()

@router.get("/boot")
async def boot():
    return get_boot_info()
