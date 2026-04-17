from fastapi import APIRouter
from app.core.system_roles import get_system_roles

router = APIRouter()

@router.get("/roles")
async def roles():
    return get_system_roles()
