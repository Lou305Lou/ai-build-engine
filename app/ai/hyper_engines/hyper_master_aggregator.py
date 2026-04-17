from typing import Dict, Any
from pydantic import BaseModel

class HyperMasterAggregateResult(BaseModel):
    final_score: float
    label: str
    reasoning: str
    hyper_layers: Dict[str, Any]

class HyperMasterAggregator:
    async def aggregate(self, hyper_layers: Dict[str, Any]) -> HyperMasterAggregateResult:
        scores = []

        for k, v in hyper_layers.items():
            if isinstance(v, dict) and "hyper_score" in v:
                scores.append(v["hyper_score"])
            if isinstance(v, dict) and "final_integrity" in v:
                scores.append(v["final_integrity"])
            if isinstance(v, dict) and "final_resolution" in v:
                scores.append(v["final_resolution"])

        if not scores:
            final_score = 0.0
        else:
            final_score = sum(scores) / len(scores)

        final_score = max(0.0, min(1.0, final_score))

        if final_score >= 0.85:
            label = "hyper-stable"
        elif final_score >= 0.60:
            label = "stable"
        else:
            label = "unstable"

        reasoning = f"final_score={final_score:.2f}"

        return HyperMasterAggregateResult(
            final_score=final_score,
            label=label,
            reasoning=reasoning,
            hyper_layers=hyper_layers
        )

hyper_master_aggregator = HyperMasterAggregator()
