from pydantic import BaseModel
from typing import Dict, Any

class MacroCompletenessResult(BaseModel):
    completeness_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroCompletenessEngine:
    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroCompletenessResult:
        completeness = micro_results["completeness"]
        score = completeness["score"]

        coverage = completeness["signals"].get("coverage_ratio", 0.0)
        sections = len(completeness["signals"].get("section_hits", []))
        missing_ratio = completeness["signals"].get("missing_ratio", 1.0)

        macro_score = (
            score * 0.6 +
            coverage * 0.2 +
            min(sections, 3) * 0.05 -
            missing_ratio * 0.15
        )

        macro_score = max(0.0, min(1.0, macro_score))

        label = "complete" if macro_score >= 0.6 else "incomplete"

        reasoning = (
            f"coverage={coverage:.2f}, sections={sections}, "
            f"missing={missing_ratio:.2f}, base={score:.2f}"
        )

        return MacroCompletenessResult(
            completeness_score=macro_score,
            label=label,
            reasoning=reasoning,
            micro_signals=micro_results
        )

macro_completeness_engine = MacroCompletenessEngine()
