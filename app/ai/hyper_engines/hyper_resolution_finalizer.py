from pydantic import BaseModel
from typing import Dict, Any

class HyperResolutionFinalResult(BaseModel):
    final_resolution: float
    label: str
    reasoning: str
    resolution_signals: Dict[str, Any]

class HyperResolutionFinalizer:
    async def finalize(self, resolution_results: Dict[str, Any]) -> HyperResolutionFinalResult:
        scores = [v["resolution_score"] for v in resolution_results.values() if "resolution_score" in v]
        final_resolution = sum(scores) / max(len(scores), 1)
        final_resolution = max(0.0, min(1.0, final_resolution))

        if final_resolution >= 0.85:
            label = "high-resolution"
        elif final_resolution >= 0.60:
            label = "resolution-stable"
        else:
            label = "resolution-risk"

        reasoning = ", ".join([f"{k}={v['resolution_score']:.2f}" for k, v in resolution_results.items()])

        return HyperResolutionFinalResult(
            final_resolution=final_resolution,
            label=label,
            reasoning=reasoning,
            resolution_signals=resolution_results
        )

hyper_resolution_finalizer = HyperResolutionFinalizer()
