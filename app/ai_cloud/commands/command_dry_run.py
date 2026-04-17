from typing import Dict, Any
from app.ai_cloud.commands.register_command import register_command

@register_command("dry_run")
async def dry_run_command(payload: Dict[str, Any]):
    return {
        "status": "dry_run_complete",
        "payload_received": payload
    }
