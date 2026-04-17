from pydantic import BaseModel
from typing import Dict, Any

class MacroFinalResult(BaseModel):
    final_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MacroFinalizer:
    async def finalize(self, macro_results: Dict[str, Any]) -> MacroFinalResult:
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

        reasoning = ", ".join([f"{k}={v['score']:.2f}" for k, v in macro_results.items()])

        return MacroFinalResult(
            final_score=final_score,
            label=label,
            reasoning=reasoning,
            macro_signals=macro_results
        )

macro_finalizer = MacroFinalizer()
