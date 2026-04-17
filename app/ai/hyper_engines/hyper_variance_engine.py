from pydantic import BaseModel
from typing import Dict, Any

class HyperVarianceResult(BaseModel):
    variance_score: float
    label: str
    reasoning: str
    hyper_layer: Dict[str, Any]

class HyperVarianceEngine:
    async def evaluate(self, hyper_results: Dict[str, Any]) -> HyperVarianceResult:
        scores = []

        for k, v in hyper_results.items():
            if "stability_score" in v:
                scores.append(v["stability_score"])
            if "drift_score" in v:
                scores.append(1.0 - v["drift_score"])
            if "contradiction_score" in v:
                scores.append(1.0 - v["contradiction_score"])

        if not scores:
            variance = 1.0
        else:
            variance = max(scores) - min(scores)

        variance = max(0.0, min(1.0, variance))

        label = "low-variance" if variance <= 0.4 else "high-variance"

        reasoning = f"variance={variance:.2f}"

        return HyperVarianceResult(
            variance_score=variance,
            label=label,
            reasoning=reasoning,
            hyper_layer=hyper_results
        )

hyper_variance_engine = HyperVarianceEngine()

