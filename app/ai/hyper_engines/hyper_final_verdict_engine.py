from typing import Dict, Any
from pydantic import BaseModel

from app.ai.hyper_engines.hyper_stability_verdict_engine import (
    hyper_stability_verdict_engine,
)

class HyperFinalVerdictResult(BaseModel):
    verdict: str
    hyper_score: float
    reasoning: str
    hyper_layer: Dict[str, Any]

class HyperFinalVerdictEngine:
    async def decide(self, synthesized_score: float, hyper_layer: Dict[str, Any]) -> HyperFinalVerdictResult:
        stability_verdict = await hyper_stability_verdict_engine.decide(synthesized_score)

        reasoning = stability_verdict.reasoning

        return HyperFinalVerdictResult(
            verdict=stability_verdict.verdict,
            hyper_score=stability_verdict.hyper_score,
            reasoning=reasoning,
            hyper_layer=hyper_layer,
        )

hyper_final_verdict_engine = HyperFinalVerdictEngine()
