from fastapi import APIRouter
from app.core.system_summary import get_system_summary

router = APIRouter()

@router.get("/summary")
async def summary():
    return get_system_summary()
