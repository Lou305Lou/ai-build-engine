from fastapi import APIRouter
from app.ai_cloud.ai_cloud_app import ai_cloud_app

router = APIRouter()

@router.get("/health")
async def health():
    return {"status": "ok", "engine_loaded": ai_cloud_app.loaded}

@router.get("/ping")
async def ping():
    return {"status": "pong"}
