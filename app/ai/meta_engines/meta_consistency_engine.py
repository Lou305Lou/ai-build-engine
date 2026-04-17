from pydantic import BaseModel
from typing import Dict, Any

class MetaConsistencyResult(BaseModel):
    consistency_score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaConsistencyEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaConsistencyResult:
        scores = [v["meta_score"] for v in meta_results.values() if "meta_score" in v]

        if not scores:
            consistency = 0.0
        else:
            spread = max(scores) - min(scores)
            consistency = 1.0 - min(1.0, spread)

        label = "consistent" if consistency >= 0.6 else "inconsistent"

        reasoning = f"spread={spread:.2f}, consistency={consistency:.2f}"

        return MetaConsistencyResult(
            consistency_score=consistency,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_consistency_engine = MetaConsistencyEngine()

