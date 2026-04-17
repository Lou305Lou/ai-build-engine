from pydantic import BaseModel
from typing import Dict, Any

class CompletenessResult(BaseModel):
    complete: bool
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroCompletenessEngine:
    """
    Evaluates whether the AI output fully answers the instruction.
    """

    def __init__(self):
        pass

    async def evaluate(self, instruction: str, output: str) -> CompletenessResult:
        signals = {}

        instruction_words = set(instruction.lower().split())
        output_words = set(output.lower().split())

        # 1. Coverage ratio
        overlap = len(instruction_words & output_words)
        coverage = overlap / max(len(instruction_words), 1)
        signals["coverage_ratio"] = coverage

        # 2. Length heuristic
        long_enough = len(output.strip()) > 25
        signals["long_enough"] = long_enough

        # 3. Section heuristic
        sections = ["introduction", "summary", "conclusion", "steps", "analysis"]
        section_hits = [s for s in sections if s in output.lower()]
        signals["section_hits"] = section_hits

        # 4. Missing content heuristic
        missing_ratio = 1.0 - coverage
        signals["missing_ratio"] = missing_ratio

        # Compute score
        score = (
            min(coverage, 1.0) * 0.5 +
            (0.2 if long_enough else 0.0) +
            min(len(section_hits), 3) * 0.1 -
            missing_ratio * 0.2
        )

        score = max(0.0, min(1.0, score))
        complete = score >= 0.5

        reasoning = (
            f"coverage={coverage:.2f}, long_enough={long_enough}, "
            f"sections={len(section_hits)}, missing_ratio={missing_ratio:.2f}"
        )

        return CompletenessResult(
            complete=complete,
            score=score,
            reasoning=reasoning,
            signals=signals
        )

completeness_engine = MicroCompletenessEngine()
