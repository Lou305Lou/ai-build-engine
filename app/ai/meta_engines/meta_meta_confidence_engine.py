from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaConfidenceResult(BaseModel):
    score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaMetaConfidenceEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaMetaConfidenceResult:
        confidence = meta_results["confidence"]["meta_confidence_score"]
        score = max(0.0, min(1.0, confidence))

        label = "meta-meta-high-confidence" if score >= 0.6 else "meta-meta-low-confidence"

        reasoning = f"meta_confidence={score:.2f}"

        return MetaMetaConfidenceResult(
            score=score,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_meta_confidence_engine = MetaMetaConfidenceEngine()
