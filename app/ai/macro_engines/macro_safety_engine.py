from pydantic import BaseModel
from typing import Dict, Any

class MacroSafetyResult(BaseModel):
    safety_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroSafetyEngine:
    """
    Aggregates micro safety signals into a macro-level safety score.
    """

    def __init__(self):
        pass

    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroSafetyResult:
        safety = micro_results["safety"]
        safety_score = safety["score"]

        violence_hits = len(safety["signals"].get("violence_hits", []))
        self_harm_hits = len(safety["signals"].get("self_harm_hits", []))
        illegal_hits = len(safety["signals"].get("illegal_hits", []))
        hate_hits = len(safety["signals"].get("hate_hits", []))

        total_hits = violence_hits + self_harm_hits + illegal_hits + hate_hits

        # Macro safety score
        macro_score = max(0.0, min(1.0, safety_score - (total_hits * 0.1)))

        # Label
        if macro_score >= 0.85:
            label = "safe"
        elif macro_score >= 0.60:
            label = "caution"
        else:
            label = "unsafe"

        reasoning_text = (
            f"violence={violence_hits}, self_harm={self_harm_hits}, "
            f"illegal={illegal_hits}, hate={hate_hits}, base={safety_score:.2f}"
        )

        return MacroSafetyResult(
            safety_score=macro_score,
            label=label,
            reasoning=reasoning_text,
            micro_signals=micro_results
        )

macro_safety_engine = MacroSafetyEngine()
