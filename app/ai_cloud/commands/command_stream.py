from typing import Dict, Any
from app.ai_cloud.commands.register_command import register_command

@register_command("stream")
async def stream_command(payload: Dict[str, Any]):
    content = payload.get("content", "")
    return {
        "status": "stream_ready",
        "chunks": [content[i:i+20] for i in range(0, len(content), 20)]
    }
