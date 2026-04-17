from pydantic import BaseModel
from typing import Dict, Any

class MetaQualityResult(BaseModel):
    meta_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MetaQualityEngine:
    async def evaluate(self, macro_results: Dict[str, Any]) -> MetaQualityResult:
        scores = [v["score"] for v in macro_results.values() if "score" in v]
        avg = sum(scores) / max(len(scores), 1)

        meta_score = max(0.0, min(1.0, avg))

        if meta_score >= 0.85:
            label = "meta-excellent"
        elif meta_score >= 0.70:
            label = "meta-good"
        elif meta_score >= 0.50:
            label = "meta-fair"
        else:
            label = "meta-poor"

        reasoning = ", ".join([f"{k}={v['score']:.2f}" for k, v in macro_results.items()])

        return MetaQualityResult(
            meta_score=meta_score,
            label=label,
            reasoning=reasoning,
            macro_signals=macro_results
        )

meta_quality_engine = MetaQualityEngine()
