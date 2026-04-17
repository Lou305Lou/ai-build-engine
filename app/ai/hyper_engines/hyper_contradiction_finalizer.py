from pydantic import BaseModel
from typing import Dict, Any

class HyperContradictionFinalResult(BaseModel):
    final_contradiction: float
    label: str
    reasoning: str
    contradiction_signals: Dict[str, Any]

class HyperContradictionFinalizer:
    async def finalize(self, hyper_results: Dict[str, Any]) -> HyperContradictionFinalResult:
        scores = [v["contradiction_score"] for v in hyper_results.values() if "contradiction_score" in v]
        final_contradiction = sum(scores) / max(len(scores), 1)
        final_contradiction = max(0.0, min(1.0, final_contradiction))

        if final_contradiction <= 0.25:
            label = "low-contradiction"
        elif final_contradiction <= 0.50:
            label = "moderate-contradiction"
        else:
            label = "high-contradiction"

        reasoning = ", ".join([f"{k}={v['contradiction_score']:.2f}" for k, v in hyper_results.items()])

        return HyperContradictionFinalResult(
            final_contradiction=final_contradiction,
            label=label,
            reasoning=reasoning,
            contradiction_signals=hyper_results
        )

hyper_contradiction_finalizer = HyperContradictionFinalizer()
