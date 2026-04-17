from pydantic import BaseModel
from typing import Dict, Any

class HyperStabilityScoreResult(BaseModel):
    hyper_score: float
    label: str
    reasoning: str

class HyperStabilityScoreEngine:
    async def score(self, integrated: Dict[str, float]) -> HyperStabilityScoreResult:
        if not integrated:
            score = 0.0
        else:
            score = sum(integrated.values()) / len(integrated)

        score = max(0.0, min(1.0, score))

        if score >= 0.85:
            label = "hyper-stable"
        elif score >= 0.60:
            label = "stable"
        else:
            label = "unstable"

        reasoning = f"hyper_score={score:.2f}"

        return HyperStabilityScoreResult(
            hyper_score=score,
            label=label,
            reasoning=reasoning
        )

hyper_stability_score_engine = HyperStabilityScoreEngine()
