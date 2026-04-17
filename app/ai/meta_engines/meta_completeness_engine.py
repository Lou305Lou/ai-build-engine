from pydantic import BaseModel
from typing import Dict, Any

class MetaCompletenessResult(BaseModel):
    meta_completeness_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MetaCompletenessEngine:
    async def evaluate(self, macro_results: Dict[str, Any]) -> MetaCompletenessResult:
        completeness = macro_results["completeness"]
        score = completeness["score"]

        meta_score = max(0.0, min(1.0, score))

        label = "meta-complete" if meta_score >= 0.6 else "meta-incomplete"

        reasoning = f"macro_completeness={score:.2f}"

        return MetaCompletenessResult(
            meta_completeness_score=meta_score,
            label=label,
            reasoning=reasoning,
            macro_signals=macro_results
        )

meta_completeness_engine = MetaCompletenessEngine()
