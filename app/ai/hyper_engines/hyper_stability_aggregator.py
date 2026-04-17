from pydantic import BaseModel
from typing import Dict, Any

class HyperStabilityAggregateResult(BaseModel):
    hyper_scores: Dict[str, Any]
    final_hyper_stability: float
    label: str

class HyperStabilityAggregator:
    async def aggregate(self, hyper_results: Dict[str, Any]) -> HyperStabilityAggregateResult:
        scores = [v["stability_score"] for v in hyper_results.values() if "stability_score" in v]

        final_stability = sum(scores) / max(len(scores), 1)
        final_stability = max(0.0, min(1.0, final_stability))

        if final_stability >= 0.85:
            label = "hyper-stable"
        elif final_stability >= 0.60:
            label = "stable"
        else:
            label = "unstable"

        return HyperStabilityAggregateResult(
            hyper_scores=hyper_results,
            final_hyper_stability=final_stability,
            label=label
        )

hyper_stability_aggregator = HyperStabilityAggregator()
