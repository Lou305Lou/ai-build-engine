from typing import Dict, Any

from app.ai.hyper_engines.hyper_phase_orchestrator import hyper_phase_orchestrator

async def run_full_stack(meta_meta_results: Dict[str, Any]):
    result = await hyper_phase_orchestrator.run(
        meta_layer=meta_meta_results.get("meta_layer", {}),
        macro_layer=meta_meta_results.get("macro_layer", {}),
        micro_layer=meta_meta_results.get("micro_layer", {}),
        hyper_layer=meta_meta_results.get("hyper_layer", {}),
    )
    return result
