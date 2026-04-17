from pydantic import BaseModel
from typing import Dict, Any

class MetaConsistencyAggregateResult(BaseModel):
    consistency_scores: Dict[str, Any]
    final_consistency: float
    label: str

class MetaConsistencyAggregator:
    async def aggregate(self, consistency_results: Dict[str, Any]) -> MetaConsistencyAggregateResult:
        scores = [v["consistency_score"] for v in consistency_results.values() if "consistency_score" in v]

        final_consistency = sum(scores) / max(len(scores), 1)
        final_consistency = max(0.0, min(1.0, final_consistency))

        if final_consistency >= 0.85:
            label = "highly-consistent"
        elif final_consistency >= 0.60:
            label = "consistent"
        else:
            label = "inconsistent"

        return MetaConsistencyAggregateResult(
            consistency_scores=consistency_results,
            final_consistency=final_consistency,
            label=label
        )

meta_consistency_aggregator = MetaConsistencyAggregator()
