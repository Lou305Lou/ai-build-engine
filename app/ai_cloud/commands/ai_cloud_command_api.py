from typing import Dict, Any
from app.ai_cloud.commands.ai_cloud_command_router import ai_cloud_command_router

class AICloudCommandAPI:
    async def handle(self, command: str, payload: Dict[str, Any]):
        return await ai_cloud_command_router.route(command, payload)

ai_cloud_command_api = AICloudCommandAPI()
