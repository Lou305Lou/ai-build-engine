from fastapi import APIRouter
from app.core.system_tree import get_system_tree

router = APIRouter()

@router.get("/tree")
async def tree():
    return get_system_tree()
