from pydantic import BaseModel
from typing import Dict, Any

class HyperDriftResult(BaseModel):
    drift_score: float
    label: str
    reasoning: str
    meta_meta_layer: Dict[str, Any]

class HyperDriftEngine:
    async def evaluate(self, meta_meta_results: Dict[str, Any]) -> HyperDriftResult:
        scores = [v["score"] for v in meta_meta_results.values() if "score" in v]

        if not scores:
            drift = 1.0
        else:
            drift = min(1.0, max(scores) - min(scores))

        label = "low-drift" if drift <= 0.4 else "high-drift"

        reasoning = f"drift={drift:.2f}"

        return HyperDriftResult(
            drift_score=drift,
            label=label,
            reasoning=reasoning,
            meta_meta_layer=meta_meta_results
        )

hyper_drift_engine = HyperDriftEngine()
