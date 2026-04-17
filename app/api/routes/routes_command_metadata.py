from fastapi import APIRouter
from app.ai_cloud.commands.command_metadata import get_command_metadata

router = APIRouter()

@router.get("/metadata")
async def metadata():
    return get_command_metadata()
