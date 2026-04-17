from typing import Dict, Any
from pydantic import BaseModel

class HyperSummaryResult(BaseModel):
    summary: str
    signals: Dict[str, Any]

class HyperSummaryEngine:
    async def summarize(self, hyper_outputs: Dict[str, Any]) -> HyperSummaryResult:
        parts = []

        for name, result in hyper_outputs.items():
            if isinstance(result, dict) and "label" in result and "reasoning" in result:
                parts.append(f"{name}: {result['label']} ({result['reasoning']})")

        summary = " | ".join(parts) if parts else "no-hyper-signals"

        return HyperSummaryResult(
            summary=summary,
            signals=hyper_outputs,
        )

hyper_summary_engine = HyperSummaryEngine()
