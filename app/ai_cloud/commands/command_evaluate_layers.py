from typing import Dict, Any
from app.ai_cloud.commands.register_command import register_command
from app.ai_cloud.integration.integration_ai_cloud_app_layers import run_hyper_with_layers

@register_command("evaluate_layers")
async def evaluate_layers_command(payload: Dict[str, Any]):
    layers = payload.get("layers", {})
    result = await run_hyper_with_layers(layers)

    return {
        "status": "evaluation_complete",
        "result": result.dict()
    }
