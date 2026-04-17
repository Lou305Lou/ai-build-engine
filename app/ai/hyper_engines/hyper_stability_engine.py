from pydantic import BaseModel
from typing import Dict, Any

class HyperStabilityResult(BaseModel):
    stability_score: float
    label: str
    reasoning: str
    meta_meta_layer: Dict[str, Any]

class HyperStabilityEngine:
    async def evaluate(self, meta_meta_results: Dict[str, Any]) -> HyperStabilityResult:
        scores = [v["score"] for v in meta_meta_results.values() if "score" in v]

        if not scores:
            stability = 0.0
        else:
            spread = max(scores) - min(scores)
            stability = 1.0 - min(1.0, spread)

        label = "hyper-stable" if stability >= 0.6 else "hyper-unstable"

        reasoning = f"spread={spread:.2f}, stability={stability:.2f}"

        return HyperStabilityResult(
            stability_score=stability,
            label=label,
            reasoning=reasoning,
            meta_meta_layer=meta_meta_results
        )

hyper_stability_engine = HyperStabilityEngine()
