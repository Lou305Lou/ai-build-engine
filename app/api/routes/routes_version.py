from fastapi import APIRouter
from app.core.version import APP_VERSION

router = APIRouter()

@router.get("/version")
async def version():
    return {"version": APP_VERSION}
