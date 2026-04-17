from fastapi import APIRouter
from app.core.system_endpoints import get_all_endpoints

router = APIRouter()

@router.get("/endpoints")
async def endpoints():
    return get_all_endpoints()
