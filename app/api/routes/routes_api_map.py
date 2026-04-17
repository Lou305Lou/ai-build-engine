from fastapi import APIRouter
from app.core.system_api_map import get_api_map

router = APIRouter()

@router.get("/map")
async def api_map():
    return get_api_map()
