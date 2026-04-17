from typing import Dict, Any
from app.ai_cloud.commands.ai_cloud_command_engine import ai_cloud_command_engine

class AICloudCommandRouter:
    async def route(self, command: str, payload: Dict[str, Any]):
        return await ai_cloud_command_engine.execute(command, payload)

ai_cloud_command_router = AICloudCommandRouter()
