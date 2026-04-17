from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaReasoningResult(BaseModel):
    score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaMetaReasoningEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaMetaReasoningResult:
        reasoning = meta_results["reasoning"]["meta_reasoning_score"]
        score = max(0.0, min(1.0, reasoning))

        label = "meta-meta-strong-reasoning" if score >= 0.6 else "meta-meta-weak-reasoning"

        reasoning_text = f"meta_reasoning={score:.2f}"

        return MetaMetaReasoningResult(
            score=score,
            label=label,
            reasoning=reasoning_text,
            meta_layer=meta_results
        )

meta_meta_reasoning_engine = MetaMetaReasoningEngine()
