from pydantic import BaseModel
from typing import Dict, Any

class HyperDriftAggregateResult(BaseModel):
    drift_scores: Dict[str, Any]
    final_drift: float
    label: str

class HyperDriftAggregator:
    async def aggregate(self, hyper_results: Dict[str, Any]) -> HyperDriftAggregateResult:
        scores = [v["drift_score"] for v in hyper_results.values() if "drift_score" in v]

        final_drift = sum(scores) / max(len(scores), 1)
        final_drift = max(0.0, min(1.0, final_drift))

        if final_drift <= 0.25:
            label = "very-low-drift"
        elif final_drift <= 0.50:
            label = "low-drift"
        else:
            label = "high-drift"

        return HyperDriftAggregateResult(
            drift_scores=hyper_results,
            final_drift=final_drift,
            label=label
        )

hyper_drift_aggregator = HyperDriftAggregator()
