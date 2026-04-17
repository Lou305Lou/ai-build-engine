from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaSafetyResult(BaseModel):
    score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaMetaSafetyEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaMetaSafetyResult:
        safety = meta_results["safety"]["meta_safety_score"]
        score = max(0.0, min(1.0, safety))

        label = "meta-meta-safe" if score >= 0.75 else "meta-meta-risk"

        reasoning = f"meta_safety={score:.2f}"

        return MetaMetaSafetyResult(
            score=score,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_meta_safety_engine = MetaMetaSafetyEngine()
