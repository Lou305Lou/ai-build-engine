from typing import Dict, Any
from app.ai_cloud.commands.register_command import register_command

@register_command("explain")
async def explain_command(payload: Dict[str, Any]):
    text = payload.get("text", "")
    return {
        "status": "explanation_complete",
        "input": text,
        "explanation": f"Explanation for: {text}"
    }
