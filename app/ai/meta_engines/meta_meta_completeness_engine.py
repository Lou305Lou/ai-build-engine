from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaCompletenessResult(BaseModel):
    score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaMetaCompletenessEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaMetaCompletenessResult:
        completeness = meta_results["completeness"]["meta_completeness_score"]
        score = max(0.0, min(1.0, completeness))

        label = "meta-meta-complete" if score >= 0.6 else "meta-meta-incomplete"

        reasoning = f"meta_completeness={score:.2f}"

        return MetaMetaCompletenessResult(
            score=score,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_meta_completeness_engine = MetaMetaCompletenessEngine()
