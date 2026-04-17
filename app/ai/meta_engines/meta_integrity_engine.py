from pydantic import BaseModel
from typing import Dict, Any

class MetaIntegrityResult(BaseModel):
    integrity_score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaIntegrityEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaIntegrityResult:
        scores = [v["meta_score"] for v in meta_results.values() if "meta_score" in v]

        if not scores:
            integrity = 0.0
        else:
            spread = max(scores) - min(scores)
            integrity = 1.0 - min(1.0, spread)

        label = "high-integrity" if integrity >= 0.6 else "low-integrity"

        reasoning = f"spread={spread:.2f}, integrity={integrity:.2f}"

        return MetaIntegrityResult(
            integrity_score=integrity,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_integrity_engine = MetaIntegrityEngine()
