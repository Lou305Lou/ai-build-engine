from pydantic import BaseModel
from typing import Dict, Any

class MacroRelevanceResult(BaseModel):
    relevance_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroRelevanceEngine:
    """
    Aggregates micro relevance signals into a macro-level relevance score.
    """

    def __init__(self):
        pass

    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroRelevanceResult:
        relevance = micro_results["relevance"]
        relevance_score = relevance["score"]

        coverage = relevance["signals"].get("coverage_ratio", 0.0)
        overlap = relevance["signals"].get("word_overlap", 0)
        key_hits = len(relevance["signals"].get("key_hits", []))
        long_enough = relevance["signals"].get("long_enough", False)

        # Macro score
        macro_score = (
            relevance_score * 0.6 +
            coverage * 0.2 +
            min(key_hits, 5) * 0.04 +
            (0.12 if long_enough else 0.0)
        )

        macro_score = max(0.0, min(1.0, macro_score))

        # Label
        if macro_score >= 0.85:
            label = "highly relevant"
        elif macro_score >= 0.60:
            label = "relevant"
        else:
            label = "low relevance"

        reasoning_text = (
            f"coverage={coverage:.2f}, overlap={overlap}, "
            f"key_hits={key_hits}, long_enough={long_enough}, "
            f"base={relevance_score:.2f}"
        )

        return MacroRelevanceResult(
            relevance_score=macro_score,
            label=label,
            reasoning=reasoning_text,
            micro_signals=micro_results
        )

macro_relevance_engine = MacroRelevanceEngine()
