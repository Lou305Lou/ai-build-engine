from typing import Dict, Any
from pydantic import BaseModel

from app.ai.hyper_engines.hyper_integrity_engine import hyper_integrity_engine
from app.ai.hyper_engines.hyper_integrity_finalizer import hyper_integrity_finalizer

class HyperIntegrityOrchestratorResult(BaseModel):
    integrity_score: float
    label: str
    reasoning: str
    details: Dict[str, Any]

class HyperIntegrityOrchestrator:
    async def run(self, hyper_results: Dict[str, Any]) -> HyperIntegrityOrchestratorResult:
        integrity = await hyper_integrity_engine.evaluate(hyper_results)

        final_result = await hyper_integrity_finalizer.finalize(
            {"integrity": integrity.dict()}
        )

        details = {
            "integrity_raw": integrity.dict(),
            "integrity_final": final_result.dict(),
        }

        return HyperIntegrityOrchestratorResult(
            integrity_score=final_result.final_integrity,
            label=final_result.label,
            reasoning=final_result.reasoning,
            details=details,
        )

hyper_integrity_orchestrator = HyperIntegrityOrchestrator()
