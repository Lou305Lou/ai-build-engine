from pydantic import BaseModel
from typing import Dict, Any

class HyperStabilityFinalResult(BaseModel):
    final_stability: float
    label: str
    reasoning: str
    hyper_signals: Dict[str, Any]

class HyperStabilityFinalizer:
    async def finalize(self, hyper_results: Dict[str, Any]) -> HyperStabilityFinalResult:
        scores = [v["stability_score"] for v in hyper_results.values() if "stability_score" in v]
        final_stability = sum(scores) / max(len(scores), 1)
        final_stability = max(0.0, min(1.0, final_stability))

        if final_stability >= 0.85:
            label = "hyper-stable"
        elif final_stability >= 0.60:
            label = "stable"
        else:
            label = "unstable"

        reasoning = ", ".join([f"{k}={v['stability_score']:.2f}" for k, v in hyper_results.items()])

        return HyperStabilityFinalResult(
            final_stability=final_stability,
            label=label,
            reasoning=reasoning,
            hyper_signals=hyper_results
        )

hyper_stability_finalizer = HyperStabilityFinalizer()
