from pydantic import BaseModel
from typing import Dict, Any

class HyperConfidenceAggregateResult(BaseModel):
    confidence_scores: Dict[str, Any]
    final_confidence: float
    label: str

class HyperConfidenceAggregator:
    async def aggregate(self, confidence_results: Dict[str, Any]) -> HyperConfidenceAggregateResult:
        scores = [v["confidence_score"] for v in confidence_results.values() if "confidence_score" in v]

        final_confidence = sum(scores) / max(len(scores), 1)
        final_confidence = max(0.0, min(1.0, final_confidence))

        if final_confidence >= 0.85:
            label = "hyper-confident"
        elif final_confidence >= 0.60:
            label = "confident"
        else:
            label = "low-confidence"

        return HyperConfidenceAggregateResult(
            confidence_scores=confidence_results,
            final_confidence=final_confidence,
            label=label
        )

hyper_confidence_aggregator = HyperConfidenceAggregator()
