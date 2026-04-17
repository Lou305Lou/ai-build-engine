from pydantic import BaseModel
from typing import Dict, Any

class HyperConfidenceFinalResult(BaseModel):
    final_confidence: float
    label: str
    reasoning: str
    confidence_signals: Dict[str, Any]

class HyperConfidenceFinalizer:
    async def finalize(self, confidence_results: Dict[str, Any]) -> HyperConfidenceFinalResult:
        scores = [v["confidence_score"] for v in confidence_results.values() if "confidence_score" in v]
        final_confidence = sum(scores) / max(len(scores), 1)
        final_confidence = max(0.0, min(1.0, final_confidence))

        if final_confidence >= 0.85:
            label = "hyper-confident"
        elif final_confidence >= 0.60:
            label = "confident"
        else:
            label = "low-confidence"

        reasoning = ", ".join([f"{k}={v['confidence_score']:.2f}" for k, v in confidence_results.items()])

        return HyperConfidenceFinalResult(
            final_confidence=final_confidence,
            label=label,
            reasoning=reasoning,
            confidence_signals=confidence_results
        )

hyper_confidence_finalizer = HyperConfidenceFinalizer()
