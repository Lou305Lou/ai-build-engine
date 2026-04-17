from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaRelevanceResult(BaseModel):
    score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaMetaRelevanceEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaMetaRelevanceResult:
        relevance = meta_results["relevance"]["meta_relevance_score"]
        score = max(0.0, min(1.0, relevance))

        label = "meta-meta-relevant" if score >= 0.6 else "meta-meta-off-topic"

        reasoning = f"meta_relevance={score:.2f}"

        return MetaMetaRelevanceResult(
            score=score,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_meta_relevance_engine = MetaMetaRelevanceEngine()
