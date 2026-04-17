from pydantic import BaseModel
from typing import Dict, Any

class MacroCoherenceResult(BaseModel):
    coherence_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroCoherenceEngine:
    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroCoherenceResult:
        coherence = micro_results["coherence"]
        score = coherence["score"]

        contradictions = len(coherence["signals"].get("contradictions", []))
        flow_hits = len(coherence["signals"].get("flow_hits", []))
        long_enough = coherence["signals"].get("long_enough", False)

        macro_score = (
            score * 0.6 +
            min(flow_hits, 3) * 0.1 +
            (0.15 if long_enough else 0.0) -
            contradictions * 0.15
        )

        macro_score = max(0.0, min(1.0, macro_score))

        label = "coherent" if macro_score >= 0.6 else "incoherent"

        reasoning = (
            f"contradictions={contradictions}, flow_hits={flow_hits}, "
            f"long_enough={long_enough}, base={score:.2f}"
        )

        return MacroCoherenceResult(
            coherence_score=macro_score,
            label=label,
            reasoning=reasoning,
            micro_signals=micro_results
        )

macro_coherence_engine = MacroCoherenceEngine()
