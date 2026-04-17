from pydantic import BaseModel
from typing import Dict, Any

class MetaConsistencyFinalResult(BaseModel):
    final_consistency: float
    label: str
    reasoning: str
    consistency_signals: Dict[str, Any]

class MetaConsistencyFinalizer:
    async def finalize(self, consistency_results: Dict[str, Any]) -> MetaConsistencyFinalResult:
        scores = [v["consistency_score"] for v in consistency_results.values() if "consistency_score" in v]
        final_consistency = sum(scores) / max(len(scores), 1)
        final_consistency = max(0.0, min(1.0, final_consistency))

        if final_consistency >= 0.85:
            label = "highly-consistent"
        elif final_consistency >= 0.60:
            label = "consistent"
        else:
            label = "inconsistent"

        reasoning = ", ".join([f"{k}={v['consistency_score']:.2f}" for k, v in consistency_results.items()])

        return MetaConsistencyFinalResult(
            final_consistency=final_consistency,
            label=label,
            reasoning=reasoning,
            consistency_signals=consistency_results
        )

meta_consistency_finalizer = MetaConsistencyFinalizer()
