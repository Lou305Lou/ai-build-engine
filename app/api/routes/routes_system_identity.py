from fastapi import APIRouter
from app.core.system_identity import get_system_identity

router = APIRouter()

@router.get("/identity")
async def identity():
    return get_system_identity()
