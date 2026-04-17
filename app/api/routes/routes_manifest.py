from fastapi import APIRouter
from app.core.system_manifest import generate_manifest

router = APIRouter()

@router.get("/manifest")
async def manifest():
    return generate_manifest()
