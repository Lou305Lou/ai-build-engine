from pydantic import BaseModel
from typing import Dict, Any

class MacroFactualityResult(BaseModel):
    factuality_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroFactualityEngine:
    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroFactualityResult:
        factuality = micro_results["factuality"]
        score = factuality["score"]

        numeric_hits = len(factuality["signals"].get("numeric_hits", []))
        factual_hits = len(factuality["signals"].get("factual_hits", []))
        speculative_hits = len(factuality["signals"].get("speculative_hits", []))

        macro_score = (
            score * 0.6 +
            min(numeric_hits, 5) * 0.05 +
            min(factual_hits, 5) * 0.05 -
            min(speculative_hits, 5) * 0.1
        )

        macro_score = max(0.0, min(1.0, macro_score))

        label = "factual" if macro_score >= 0.6 else "unreliable"

        reasoning = (
            f"numeric={numeric_hits}, factual={factual_hits}, "
            f"speculative={speculative_hits}, base={score:.2f}"
        )

        return MacroFactualityResult(
            factuality_score=macro_score,
            label=label,
            reasoning=reasoning,
            micro_signals=micro_results
        )

macro_factuality_engine = MacroFactualityEngine()
