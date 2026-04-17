from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaFactualityResult(BaseModel):
    score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaMetaFactualityEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaMetaFactualityResult:
        factuality = meta_results["factuality"]["meta_factuality_score"]
        score = max(0.0, min(1.0, factuality))

        label = "meta-meta-factual" if score >= 0.6 else "meta-meta-unreliable"

        reasoning = f"meta_factuality={score:.2f}"

        return MetaMetaFactualityResult(
            score=score,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_meta_factuality_engine = MetaMetaFactualityEngine()
