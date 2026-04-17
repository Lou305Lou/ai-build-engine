from pydantic import BaseModel
from typing import Dict, Any

class MetaStabilityAggregateResult(BaseModel):
    stability_scores: Dict[str, Any]
    final_stability: float
    label: str

class MetaStabilityAggregator:
    async def aggregate(self, stability_results: Dict[str, Any]) -> MetaStabilityAggregateResult:
        scores = [v["stability_score"] for v in stability_results.values() if "stability_score" in v]

        final_stability = sum(scores) / max(len(scores), 1)
        final_stability = max(0.0, min(1.0, final_stability))

        if final_stability >= 0.85:
            label = "highly-stable"
        elif final_stability >= 0.60:
            label = "stable"
        else:
            label = "unstable"

        return MetaStabilityAggregateResult(
            stability_scores=stability_results,
            final_stability=final_stability,
            label=label
        )

meta_stability_aggregator = MetaStabilityAggregator()
