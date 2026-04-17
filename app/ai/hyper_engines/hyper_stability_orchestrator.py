from typing import Dict, Any
from pydantic import BaseModel

from app.ai.hyper_engines.hyper_stability_engine import hyper_stability_engine
from app.ai.hyper_engines.hyper_drift_engine import hyper_drift_engine
from app.ai.hyper_engines.hyper_contradiction_engine import hyper_contradiction_engine
from app.ai.hyper_engines.hyper_signal_normalizer import hyper_signal_normalizer
from app.ai.hyper_engines.hyper_signal_integrator import hyper_signal_integrator
from app.ai.hyper_engines.hyper_stability_score_engine import hyper_stability_score_engine

class HyperStabilityOrchestratorResult(BaseModel):
    hyper_stability_score: float
    label: str
    reasoning: str
    details: Dict[str, Any]

class HyperStabilityOrchestrator:
    async def run(self, meta_meta_results: Dict[str, Any]) -> HyperStabilityOrchestratorResult:
        stability = await hyper_stability_engine.evaluate(meta_meta_results)
        drift = await hyper_drift_engine.evaluate(meta_meta_results)
        contradiction = await hyper_contradiction_engine.evaluate(meta_meta_results)

        hyper_results: Dict[str, Any] = {
            "stability": stability.dict(),
            "drift": drift.dict(),
            "contradiction": contradiction.dict(),
        }

        normalized = await hyper_signal_normalizer.normalize(hyper_results)
        integrated = await hyper_signal_integrator.integrate(normalized.normalized)
        score_result = await hyper_stability_score_engine.score(integrated.integrated)

        details = {
            "stability": stability.dict(),
            "drift": drift.dict(),
            "contradiction": contradiction.dict(),
            "normalized": normalized.dict(),
            "integrated": integrated.dict(),
        }

        return HyperStabilityOrchestratorResult(
            hyper_stability_score=score_result.hyper_score,
            label=score_result.label,
            reasoning=score_result.reasoning,
            details=details,
        )

hyper_stability_orchestrator = HyperStabilityOrchestrator()
