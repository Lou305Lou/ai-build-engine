from typing import Dict, Any
from app.ai_cloud.commands.register_command import register_command
from app.ai_cloud.integration.integration_hyper_meta_macro_micro import run_full_stack

@register_command("evaluate")
async def evaluate_command(payload: Dict[str, Any]):
    meta_meta_results = payload.get("meta_meta_results", {})
    result = await run_full_stack(meta_meta_results)

    return {
        "status": "evaluation_complete",
        "result": result.dict()
    }
