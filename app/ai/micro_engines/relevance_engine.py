from pydantic import BaseModel
from typing import Dict, Any

class RelevanceResult(BaseModel):
    relevant: bool
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroRelevanceEngine:
    """
    Evaluates how relevant the AI output is to the instruction/query.
    """

    def __init__(self):
        pass

    async def evaluate(self, instruction: str, output: str) -> RelevanceResult:
        signals = {}

        instruction_words = set(instruction.lower().split())
        output_words = set(output.lower().split())

        # 1. Word overlap
        overlap = len(instruction_words & output_words)
        signals["word_overlap"] = overlap

        # 2. Coverage ratio
        coverage = overlap / max(len(instruction_words), 1)
        signals["coverage_ratio"] = coverage

        # 3. Output length heuristic
        long_enough = len(output.strip()) > 15
        signals["long_enough"] = long_enough

        # 4. Direct keyword presence
        key_hits = [w for w in instruction_words if w in output_words]
        signals["key_hits"] = key_hits

        # Compute score
        score = (
            min(coverage, 1.0) * 0.5 +
            (0.2 if long_enough else 0.0) +
            (min(len(key_hits), 5) / 5) * 0.3
        )

        score = max(0.0, min(1.0, score))
        relevant = score >= 0.5

        reasoning = (
            f"overlap={overlap}, coverage={coverage:.2f}, "
            f"key_hits={len(key_hits)}, long_enough={long_enough}"
        )

        return RelevanceResult(
            relevant=relevant,
            score=score,
            reasoning=reasoning,
            signals=signals
        )

relevance_engine = MicroRelevanceEngine()
