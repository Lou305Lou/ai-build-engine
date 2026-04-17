from fastapi import APIRouter
from app.core.system_labels import get_system_labels

router = APIRouter()

@router.get("/labels")
async def labels():
    return get_system_labels()
