from fastapi import APIRouter
from app.ai_cloud.ai_cloud_app_info import get_app_info

router = APIRouter()

@router.get("/info")
async def info():
    return get_app_info()
