from pydantic import BaseModel
from typing import Dict, Any

class MetaAggregateResult(BaseModel):
    meta_scores: Dict[str, Any]
    final_meta_score: float
    label: str

class MetaAggregator:
    async def aggregate(self, meta_results: Dict[str, Any]) -> MetaAggregateResult:
        scores = [v["meta_score"] for v in meta_results.values() if "meta_score" in v]

        final_score = sum(scores) / max(len(scores), 1)
        final_score = max(0.0, min(1.0, final_score))

        if final_score >= 0.85:
            label = "meta-excellent"
        elif final_score >= 0.70:
            label = "meta-good"
        elif final_score >= 0.50:
            label = "meta-fair"
        else:
            label = "meta-poor"

        return MetaAggregateResult(
            meta_scores=meta_results,
            final_meta_score=final_score,
            label=label
        )

meta_aggregator = MetaAggregator()
