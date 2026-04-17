from pydantic import BaseModel
from typing import Dict, Any

class MetaReasoningResult(BaseModel):
    meta_reasoning_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MetaReasoningEngine:
    async def evaluate(self, macro_results: Dict[str, Any]) -> MetaReasoningResult:
        reasoning = macro_results["reasoning"]
        score = reasoning["score"]

        meta_score = max(0.0, min(1.0, score))

        label = "meta-strong-reasoning" if meta_score >= 0.6 else "meta-weak-reasoning"

        reasoning_text = f"macro_reasoning={score:.2f}"

        return MetaReasoningResult(
            meta_reasoning_score=meta_score,
            label=label,
            reasoning=reasoning_text,
            macro_signals=macro_results
        )

meta_reasoning_engine = MetaReasoningEngine()
