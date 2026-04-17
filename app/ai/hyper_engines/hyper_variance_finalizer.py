from pydantic import BaseModel
from typing import Dict, Any

class HyperVarianceFinalResult(BaseModel):
    final_variance: float
    label: str
    reasoning: str
    variance_signals: Dict[str, Any]

class HyperVarianceFinalizer:
    async def finalize(self, variance_results: Dict[str, Any]) -> HyperVarianceFinalResult:
        scores = [v["variance_score"] for v in variance_results.values() if "variance_score" in v]
        final_variance = sum(scores) / max(len(scores), 1)
        final_variance = max(0.0, min(1.0, final_variance))

        if final_variance <= 0.25:
            label = "low-variance"
        elif final_variance <= 0.50:
            label = "moderate-variance"
        else:
            label = "high-variance"

        reasoning = ", ".join([f"{k}={v['variance_score']:.2f}" for k, v in variance_results.items()])

        return HyperVarianceFinalResult(
            final_variance=final_variance,
            label=label,
            reasoning=reasoning,
            variance_signals=variance_results
        )

hyper_variance_finalizer = HyperVarianceFinalizer()

