from pydantic import BaseModel
from typing import Dict, Any

class MetaCoherenceResult(BaseModel):
    meta_coherence_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MetaCoherenceEngine:
    async def evaluate(self, macro_results: Dict[str, Any]) -> MetaCoherenceResult:
        coherence = macro_results["coherence"]
        score = coherence["score"]

        meta_score = max(0.0, min(1.0, score))

        label = "meta-coherent" if meta_score >= 0.6 else "meta-incoherent"

        reasoning = f"macro_coherence={score:.2f}"

        return MetaCoherenceResult(
            meta_coherence_score=meta_score,
            label=label,
            reasoning=reasoning,
            macro_signals=macro_results
        )

meta_coherence_engine = MetaCoherenceEngine()
