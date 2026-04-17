from pydantic import BaseModel
from typing import Dict, Any

class MetaFactualityResult(BaseModel):
    meta_factuality_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MetaFactualityEngine:
    async def evaluate(self, macro_results: Dict[str, Any]) -> MetaFactualityResult:
        factuality = macro_results["factuality"]
        score = factuality["score"]

        meta_score = max(0.0, min(1.0, score))

        label = "meta-factual" if meta_score >= 0.6 else "meta-unreliable"

        reasoning = f"macro_factuality={score:.2f}"

        return MetaFactualityResult(
            meta_factuality_score=meta_score,
            label=label,
            reasoning=reasoning,
            macro_signals=macro_results
        )

meta_factuality_engine = MetaFactualityEngine()
