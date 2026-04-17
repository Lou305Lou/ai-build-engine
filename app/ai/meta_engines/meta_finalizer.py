from pydantic import BaseModel
from typing import Dict, Any

class MetaFinalResult(BaseModel):
    final_meta_score: float
    label: str
    reasoning: str
    meta_signals: Dict[str, Any]

class MetaFinalizer:
    async def finalize(self, meta_results: Dict[str, Any]) -> MetaFinalResult:
        scores = [v["meta_score"] for v in meta_results.values() if "meta_score" in v]
        final_score = sum(scores) / max(len(scores), 1)
        final_score = max(0.0, min(1.0, final_score))

        if final_score >= 0.85:
            label = "meta-excellent"
        elif final_score >= 0.70:
            label = "meta-good"
        elif final_score >= 0.50:
            label = "meta-fair"
        else:
            label = "meta-poor"

        reasoning = ", ".join([f"{k}={v['meta_score']:.2f}" for k, v in meta_results.items()])

        return MetaFinalResult(
            final_meta_score=final_score,
            label=label,
            reasoning=reasoning,
            meta_signals=meta_results
        )

meta_finalizer = MetaFinalizer()
