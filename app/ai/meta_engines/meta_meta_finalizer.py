from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaFinalResult(BaseModel):
    final_score: float
    label: str
    reasoning: str
    meta_meta_signals: Dict[str, Any]

class MetaMetaFinalizer:
    async def finalize(self, meta_meta_results: Dict[str, Any]) -> MetaMetaFinalResult:
        scores = [v["score"] for v in meta_meta_results.values() if "score" in v]
        final_score = sum(scores) / max(len(scores), 1)
        final_score = max(0.0, min(1.0, final_score))

        if final_score >= 0.85:
            label = "meta-meta-excellent"
        elif final_score >= 0.70:
            label = "meta-meta-good"
        elif final_score >= 0.50:
            label = "meta-meta-fair"
        else:
            label = "meta-meta-poor"

        reasoning = ", ".join([f"{k}={v['score']:.2f}" for k, v in meta_meta_results.items()])

        return MetaMetaFinalResult(
            final_score=final_score,
            label=label,
            reasoning=reasoning,
            meta_meta_signals=meta_meta_results
        )

meta_meta_finalizer = MetaMetaFinalizer()
