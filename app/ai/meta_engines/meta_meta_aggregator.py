from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaAggregateResult(BaseModel):
    meta_meta_scores: Dict[str, Any]
    final_score: float
    label: str

class MetaMetaAggregator:
    async def aggregate(self, meta_meta_results: Dict[str, Any]) -> MetaMetaAggregateResult:
        scores = [v["score"] for v in meta_meta_results.values() if "score" in v]

        final_score = sum(scores) / max(len(scores), 1)
        final_score = max(0.0, min(1.0, final_score))

        if final_score >= 0.85:
            label = "meta-meta-excellent"
        elif final_score >= 0.70:
            label = "meta-meta-good"
        elif final_score >= 0.50:
            label = "meta-meta-fair"
        else:
            label = "meta-meta-poor"

        return MetaMetaAggregateResult(
            meta_meta_scores=meta_meta_results,
            final_score=final_score,
            label=label
        )

meta_meta_aggregator = MetaMetaAggregator()
