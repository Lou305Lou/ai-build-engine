from pydantic import BaseModel
from typing import Dict, Any

class HyperCorrectionAggregateResult(BaseModel):
    actions: Dict[str, str]
    summary: str

class HyperCorrectionAggregator:
    async def aggregate(self, correction_results: Dict[str, Any]) -> HyperCorrectionAggregateResult:
        actions = {}

        for k, v in correction_results.items():
            if "correction_plan" in v:
                actions[k] = v["correction_plan"]

        summary = f"{len(actions)} correction sets aggregated"

        return HyperCorrectionAggregateResult(
            actions=actions,
            summary=summary
        )

hyper_correction_aggregator = HyperCorrectionAggregator()
