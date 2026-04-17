from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaQualityResult(BaseModel):
    score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaMetaQualityEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaMetaQualityResult:
        scores = [v["meta_score"] for v in meta_results.values() if "meta_score" in v]
        avg = sum(scores) / max(len(scores), 1)
        score = max(0.0, min(1.0, avg))

        label = "meta-meta-strong" if score >= 0.6 else "meta-meta-weak"

        reasoning = ", ".join([f"{k}={v['meta_score']:.2f}" for k, v in meta_results.items()])

        return MetaMetaQualityResult(
            score=score,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_meta_quality_engine = MetaMetaQualityEngine()
