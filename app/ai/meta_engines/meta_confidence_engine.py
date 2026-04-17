from pydantic import BaseModel
from typing import Dict, Any

class MetaConfidenceResult(BaseModel):
    meta_confidence_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MetaConfidenceEngine:
    async def evaluate(self, macro_results: Dict[str, Any]) -> MetaConfidenceResult:
        confidence = macro_results["confidence"]
        score = confidence["score"]

        meta_score = max(0.0, min(1.0, score))

        label = "meta-high-confidence" if meta_score >= 0.6 else "meta-low-confidence"

        reasoning = f"macro_confidence={score:.2f}"

        return MetaConfidenceResult(
            meta_confidence_score=meta_score,
            label=label,
            reasoning=reasoning,
            macro_signals=macro_results
        )

meta_confidence_engine = MetaConfidenceEngine()
