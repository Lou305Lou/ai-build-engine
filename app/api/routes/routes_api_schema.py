from fastapi import APIRouter
from app.core.system_api_schema import get_api_schema

router = APIRouter()

@router.get("/schema")
async def schema():
    return get_api_schema()
