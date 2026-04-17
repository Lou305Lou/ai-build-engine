from pydantic import BaseModel
from typing import Dict, Any

class HyperIntegrityFinalResult(BaseModel):
    final_integrity: float
    label: str
    reasoning: str
    integrity_signals: Dict[str, Any]

class HyperIntegrityFinalizer:
    async def finalize(self, integrity_results: Dict[str, Any]) -> HyperIntegrityFinalResult:
        scores = [v["integrity_score"] for v in integrity_results.values() if "integrity_score" in v]
        final_integrity = sum(scores) / max(len(scores), 1)
        final_integrity = max(0.0, min(1.0, final_integrity))

        if final_integrity >= 0.85:
            label = "high-integrity"
        elif final_integrity >= 0.60:
            label = "integrity-stable"
        else:
            label = "integrity-risk"

        reasoning = ", ".join([f"{k}={v['integrity_score']:.2f}" for k, v in integrity_results.items()])

        return HyperIntegrityFinalResult(
            final_integrity=final_integrity,
            label=label,
            reasoning=reasoning,
            integrity_signals=integrity_results
        )

hyper_integrity_finalizer = HyperIntegrityFinalizer()
