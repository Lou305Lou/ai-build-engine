from pydantic import BaseModel
from typing import Dict, Any

class MacroConfidenceResult(BaseModel):
    confidence_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroConfidenceEngine:
    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroConfidenceResult:
        confidence = micro_results["confidence"]
        score = confidence["score"]

        repetition = confidence["signals"].get("repetition_penalty", 0.0)
        hallucination = confidence["signals"].get("hallucination_risk", 0.0)
        completeness = confidence["signals"].get("completeness", 0.0)

        macro_score = (
            score * 0.6 +
            completeness * 0.2 -
            repetition * 0.1 -
            hallucination * 0.1
        )

        macro_score = max(0.0, min(1.0, macro_score))

        label = "high confidence" if macro_score >= 0.6 else "low confidence"

        reasoning = (
            f"repetition={repetition:.2f}, hallucination={hallucination:.2f}, "
            f"completeness={completeness:.2f}, base={score:.2f}"
        )

        return MacroConfidenceResult(
            confidence_score=macro_score,
            label=label,
            reasoning=reasoning,
            micro_signals=micro_results
        )

macro_confidence_engine = MacroConfidenceEngine()
