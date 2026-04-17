from pydantic import BaseModel
from typing import Dict, Any

class HyperContradictionAggregateResult(BaseModel):
    contradiction_scores: Dict[str, Any]
    final_contradiction: float
    label: str

class HyperContradictionAggregator:
    async def aggregate(self, hyper_results: Dict[str, Any]) -> HyperContradictionAggregateResult:
        scores = [v["contradiction_score"] for v in hyper_results.values() if "contradiction_score" in v]

        final_contradiction = sum(scores) / max(len(scores), 1)
        final_contradiction = max(0.0, min(1.0, final_contradiction))

        if final_contradiction <= 0.25:
            label = "low-contradiction"
        elif final_contradiction <= 0.50:
            label = "moderate-contradiction"
        else:
            label = "high-contradiction"

        return HyperContradictionAggregateResult(
            contradiction_scores=hyper_results,
            final_contradiction=final_contradiction,
            label=label
        )

hyper_contradiction_aggregator = HyperContradictionAggregator()
