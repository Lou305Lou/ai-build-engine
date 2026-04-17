from pydantic import BaseModel
from typing import Dict, Any

class HyperIntegrityResult(BaseModel):
    integrity_score: float
    label: str
    reasoning: str
    hyper_layer: Dict[str, Any]

class HyperIntegrityEngine:
    async def evaluate(self, hyper_results: Dict[str, Any]) -> HyperIntegrityResult:
        scores = []

        for k, v in hyper_results.items():
            if "stability_score" in v:
                scores.append(v["stability_score"])
            if "drift_score" in v:
                scores.append(1.0 - v["drift_score"])
            if "contradiction_score" in v:
                scores.append(1.0 - v["contradiction_score"])

        if not scores:
            integrity = 0.0
        else:
            integrity = sum(scores) / len(scores)

        integrity = max(0.0, min(1.0, integrity))

        label = "high-integrity" if integrity >= 0.6 else "low-integrity"

        reasoning = f"integrity={integrity:.2f}"

        return HyperIntegrityResult(
            integrity_score=integrity,
            label=label,
            reasoning=reasoning,
            hyper_layer=hyper_results
        )

hyper_integrity_engine = HyperIntegrityEngine()
