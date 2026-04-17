from typing import Dict, Any
from app.ai_cloud.commands.register_command import register_command

@register_command("health")
async def health_command(payload: Dict[str, Any]):
    return {
        "status": "healthy",
        "uptime": "active"
    }
