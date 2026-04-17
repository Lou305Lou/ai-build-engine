from pydantic import BaseModel
from typing import Dict, Any

class HyperConfidenceResult(BaseModel):
    confidence_score: float
    label: str
    reasoning: str
    hyper_layer: Dict[str, Any]

class HyperConfidenceEngine:
    async def evaluate(self, hyper_results: Dict[str, Any]) -> HyperConfidenceResult:
        scores = []

        for k, v in hyper_results.items():
            if "stability_score" in v:
                scores.append(v["stability_score"])
            if "integrity_score" in v:
                scores.append(v["integrity_score"])
            if "variance_score" in v:
                scores.append(1.0 - v["variance_score"])

        if not scores:
            confidence = 0.0
        else:
            confidence = sum(scores) / len(scores)

        confidence = max(0.0, min(1.0, confidence))

        label = "hyper-confident" if confidence >= 0.6 else "hyper-low-confidence"

        reasoning = f"confidence={confidence:.2f}"

        return HyperConfidenceResult(
            confidence_score=confidence,
            label=label,
            reasoning=reasoning,
            hyper_layer=hyper_results
        )

hyper_confidence_engine = HyperConfidenceEngine()
