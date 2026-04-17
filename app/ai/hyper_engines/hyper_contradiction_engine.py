from pydantic import BaseModel
from typing import Dict, Any

class HyperContradictionResult(BaseModel):
    contradiction_score: float
    label: str
    reasoning: str
    meta_meta_layer: Dict[str, Any]

class HyperContradictionEngine:
    async def evaluate(self, meta_meta_results: Dict[str, Any]) -> HyperContradictionResult:
        contradictions = 0

        for k, v in meta_meta_results.items():
            if "label" in v and "weak" in v["label"]:
                contradictions += 1

        contradiction_score = min(1.0, contradictions * 0.1)

        label = "contradiction-low" if contradiction_score <= 0.3 else "contradiction-high"

        reasoning = f"contradictions={contradictions}, score={contradiction_score:.2f}"

        return HyperContradictionResult(
            contradiction_score=contradiction_score,
            label=label,
            reasoning=reasoning,
            meta_meta_layer=meta_meta_results
        )

hyper_contradiction_engine = HyperContradictionEngine()
