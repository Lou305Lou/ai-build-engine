from typing import Dict, Any
from pydantic import BaseModel

from app.ai.hyper_engines.hyper_correction_engine import hyper_correction_engine
from app.ai.hyper_engines.hyper_correction_aggregator import hyper_correction_aggregator
from app.ai.hyper_engines.hyper_correction_finalizer import hyper_correction_finalizer

class HyperCorrectionOrchestratorResult(BaseModel):
    correction_plan: Dict[str, Any]
    reasoning: str

class HyperCorrectionOrchestrator:
    async def run(self, hyper_results: Dict[str, Any]) -> HyperCorrectionOrchestratorResult:
        base_plan = await hyper_correction_engine.generate_plan(hyper_results)

        aggregated = await hyper_correction_aggregator.aggregate(
            {"base": base_plan.dict()}
        )

        final_plan = await hyper_correction_finalizer.finalize(aggregated.actions)

        reasoning = f"{base_plan.reasoning} | {final_plan.reasoning}"

        return HyperCorrectionOrchestratorResult(
            correction_plan=final_plan.final_plan,
            reasoning=reasoning,
        )

hyper_correction_orchestrator = HyperCorrectionOrchestrator()
