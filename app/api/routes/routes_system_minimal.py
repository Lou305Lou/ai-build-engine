from fastapi import APIRouter
from app.core.system_minimal import get_system_minimal

router = APIRouter()

@router.get("/minimal")
async def minimal():
    return get_system_minimal()
