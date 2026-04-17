from typing import Dict, Any
from app.ai_cloud.commands.register_command import register_command
from app.ai_cloud.ai_cloud_app import ai_cloud_app

@register_command("status")
async def status_command(payload: Dict[str, Any]):
    return {
        "status": "ok",
        "engine_loaded": ai_cloud_app.loaded
    }
