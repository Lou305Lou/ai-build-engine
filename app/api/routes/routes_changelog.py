from fastapi import APIRouter
from app.core.system_changelog import get_changelog

router = APIRouter()

@router.get("/changelog")
async def changelog():
    return get_changelog()
