from pydantic import BaseModel
from typing import Dict, Any

class MetaSafetyResult(BaseModel):
    meta_safe: bool
    meta_safety_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MetaSafetyEngine:
    async def evaluate(self, macro_results: Dict[str, Any]) -> MetaSafetyResult:
        safety = macro_results["safety"]
        score = safety["score"]

        meta_score = max(0.0, min(1.0, score))

        label = "safe" if meta_score >= 0.75 else "caution" if meta_score >= 0.5 else "unsafe"

        reasoning = f"macro_safety={score:.2f}"

        return MetaSafetyResult(
            meta_safe=meta_score >= 0.75,
            meta_safety_score=meta_score,
            label=label,
            reasoning=reasoning,
            macro_signals=macro_results
        )

meta_safety_engine = MetaSafetyEngine()
