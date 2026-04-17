from pydantic import BaseModel
from typing import Dict, Any

class MacroAggregateResult(BaseModel):
    macro_scores: Dict[str, Any]
    final_score: float
    label: str

class MacroAggregator:
    async def aggregate(self, macro_results: Dict[str, Any]) -> MacroAggregateResult:
        scores = [v["score"] for v in macro_results.values() if "score" in v]

        final_score = sum(scores) / max(len(scores), 1)
        final_score = max(0.0, min(1.0, final_score))

        if final_score >= 0.85:
            label = "excellent"
        elif final_score >= 0.70:
            label = "good"
        elif final_score >= 0.50:
            label = "fair"
        else:
            label = "poor"

        return MacroAggregateResult(
            macro_scores=macro_results,
            final_score=final_score,
            label=label
        )

macro_aggregator = MacroAggregator()
