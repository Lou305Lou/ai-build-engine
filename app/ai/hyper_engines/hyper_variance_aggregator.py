from pydantic import BaseModel
from typing import Dict, Any

class HyperVarianceAggregateResult(BaseModel):
    variance_scores: Dict[str, Any]
    final_variance: float
    label: str

class HyperVarianceAggregator:
    async def aggregate(self, variance_results: Dict[str, Any]) -> HyperVarianceAggregateResult:
        scores = [v["variance_score"] for v in variance_results.values() if "variance_score" in v]

        final_variance = sum(scores) / max(len(scores), 1)
        final_variance = max(0.0, min(1.0, final_variance))

        if final_variance <= 0.25:
            label = "low-variance"
        elif final_variance <= 0.50:
            label = "moderate-variance"
        else:
            label = "high-variance"

        return HyperVarianceAggregateResult(
            variance_scores=variance_results,
            final_variance=final_variance,
            label=label
        )

hyper_variance_aggregator = HyperVarianceAggregator()
