from pydantic import BaseModel
from typing import Dict, Any

class MacroReasoningResult(BaseModel):
    reasoning_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroReasoningEngine:
    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroReasoningResult:
        reasoning = micro_results["reasoning"]
        score = reasoning["score"]

        reasoning_hits = len(reasoning["signals"].get("reasoning_hits", []))
        weak_hits = len(reasoning["signals"].get("weak_hits", []))
        step_hits = len(reasoning["signals"].get("step_hits", []))

        macro_score = (
            score * 0.6 +
            min(reasoning_hits, 5) * 0.05 +
            min(step_hits, 5) * 0.05 -
            min(weak_hits, 5) * 0.1
        )

        macro_score = max(0.0, min(1.0, macro_score))

        label = "strong reasoning" if macro_score >= 0.6 else "weak reasoning"

        reasoning_text = (
            f"reasoning_hits={reasoning_hits}, weak_hits={weak_hits}, "
            f"steps={step_hits}, base={score:.2f}"
        )

        return MacroReasoningResult(
            reasoning_score=macro_score,
            label=label,
            reasoning=reasoning_text,
            micro_signals=micro_results
        )

macro_reasoning_engine = MacroReasoningEngine()
