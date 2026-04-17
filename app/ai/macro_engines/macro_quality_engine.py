from pydantic import BaseModel
from typing import Dict, Any

class MacroQualityResult(BaseModel):
    macro_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroQualityEngine:
    """
    Aggregates micro-engine outputs into a macro-level quality score.
    """

    def __init__(self):
        pass

    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroQualityResult:
        # Extract micro scores
        confidence = micro_results["confidence"]["score"]
        validation = micro_results["validation"]["score"]
        safety = micro_results["safety"]["score"]
        coherence = micro_results["coherence"]["score"]
        relevance = micro_results["relevance"]["score"]
        style = micro_results.get("style", {}).get("score", 0.5)
        factuality = micro_results.get("factuality", {}).get("score", 0.5)
        reasoning = micro_results.get("reasoning", {}).get("score", 0.5)
        completeness = micro_results.get("completeness", {}).get("score", 0.5)

        # Weighted macro score
        macro_score = (
            confidence * 0.15 +
            validation * 0.15 +
            safety * 0.15 +
            coherence * 0.10 +
            relevance * 0.10 +
            style * 0.10 +
            factuality * 0.10 +
            reasoning * 0.10 +
            completeness * 0.05
        )

        macro_score = max(0.0, min(1.0, macro_score))

        # Label
        if macro_score >= 0.85:
            label = "excellent"
        elif macro_score >= 0.70:
            label = "good"
        elif macro_score >= 0.50:
            label = "fair"
        else:
            label = "poor"

        reasoning_text = (
            f"confidence={confidence:.2f}, validation={validation:.2f}, safety={safety:.2f}, "
            f"coherence={coherence:.2f}, relevance={relevance:.2f}, style={style:.2f}, "
            f"factuality={factuality:.2f}, reasoning={reasoning:.2f}, completeness={completeness:.2f}"
        )

        return MacroQualityResult(
            macro_score=macro_score,
            label=label,
            reasoning=reasoning_text,
            micro_signals=micro_results
        )

macro_quality_engine = MacroQualityEngine()
