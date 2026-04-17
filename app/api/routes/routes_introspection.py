from fastapi import APIRouter
from app.ai_cloud.commands.command_introspection import introspect_commands

router = APIRouter()

@router.get("/commands")
async def introspect():
    return introspect_commands()
