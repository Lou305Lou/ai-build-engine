from fastapi import APIRouter
from app.core.system_dependencies import get_dependencies

router = APIRouter()

@router.get("/dependencies")
async def dependencies():
    return get_dependencies()
