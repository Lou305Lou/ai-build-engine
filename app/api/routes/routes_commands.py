from fastapi import APIRouter
from app.ai_cloud.commands.ai_cloud_command_api import ai_cloud_command_api
from app.ai_cloud.commands.ai_cloud_command_request import AICloudCommandRequest

router = APIRouter()

@router.post("/")
async def handle_command(request: AICloudCommandRequest):
    result = await ai_cloud_command_api.handle(request.command, request.payload)
    return result
