from fastapi import APIRouter
from app.core.system_release_notes import get_release_notes

router = APIRouter()

@router.get("/release")
async def release():
    return get_release_notes()
