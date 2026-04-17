from pydantic import BaseModel
from typing import Dict, Any

class HyperDriftFinalResult(BaseModel):
    final_drift: float
    label: str
    reasoning: str
    drift_signals: Dict[str, Any]

class HyperDriftFinalizer:
    async def finalize(self, hyper_results: Dict[str, Any]) -> HyperDriftFinalResult:
        scores = [v["drift_score"] for v in hyper_results.values() if "drift_score" in v]
        final_drift = sum(scores) / max(len(scores), 1)
        final_drift = max(0.0, min(1.0, final_drift))

        if final_drift <= 0.25:
            label = "very-low-drift"
        elif final_drift <= 0.50:
            label = "low-drift"
        else:
            label = "high-drift"

        reasoning = ", ".join([f"{k}={v['drift_score']:.2f}" for k, v in hyper_results.items()])

        return HyperDriftFinalResult(
            final_drift=final_drift,
            label=label,
            reasoning=reasoning,
            drift_signals=hyper_results
        )

hyper_drift_finalizer = HyperDriftFinalizer()
