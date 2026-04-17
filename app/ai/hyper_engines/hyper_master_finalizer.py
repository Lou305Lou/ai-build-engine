from typing import Dict, Any
from pydantic import BaseModel

class HyperMasterFinalResult(BaseModel):
    final_score: float
    label: str
    reasoning: str
    hyper_summary: Dict[str, Any]

class HyperMasterFinalizer:
    async def finalize(self, master_result: Dict[str, Any]) -> HyperMasterFinalResult:
        score = master_result.get("final_score", 0.0)
        label = master_result.get("label", "unknown")
        reasoning = master_result.get("reasoning", "no-reasoning")

        return HyperMasterFinalResult(
            final_score=score,
            label=label,
            reasoning=reasoning,
            hyper_summary=master_result
        )

hyper_master_finalizer = HyperMasterFinalizer()
