from pydantic import BaseModel
from typing import Dict, Any

class MetaStabilityResult(BaseModel):
    stability_score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaStabilityEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaStabilityResult:
        scores = [v["meta_score"] for v in meta_results.values() if "meta_score" in v]

        variance = max(scores) - min(scores) if scores else 1.0
        stability = 1.0 - min(1.0, variance)

        label = "stable" if stability >= 0.6 else "unstable"

        reasoning = f"variance={variance:.2f}, stability={stability:.2f}"

        return MetaStabilityResult(
            stability_score=stability,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_stability_engine = MetaStabilityEngine()
