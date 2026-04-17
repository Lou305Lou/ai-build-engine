from fastapi import APIRouter
from app.core.system_tags import get_system_tags

router = APIRouter()

@router.get("/tags")
async def tags():
    return {"tags": get_system_tags()}
