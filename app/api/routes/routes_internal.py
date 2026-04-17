from fastapi import APIRouter
from app.internal.internal_tools_index import internal_tools

router = APIRouter()

@router.get("/tools")
async def tools():
    return internal_tools()
