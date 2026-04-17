from pydantic import BaseModel
from typing import Dict, Any

class ReasoningResult(BaseModel):
    reasoned: bool
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroReasoningEngine:
    """
    Evaluates the reasoning quality of AI output.
    """

    def __init__(self):
        # Markers that often indicate reasoning structure
        self.reasoning_markers = [
            "because",
            "therefore",
            "thus",
            "so",
            "this means",
            "as a result",
            "the reason is",
            "first",
            "second",
            "finally",
        ]

        # Markers that often indicate weak reasoning
        self.weak_markers = [
            "i guess",
            "maybe",
            "probably",
            "i think",
            "not sure",
        ]

    async def evaluate(self, output: str) -> ReasoningResult:
        signals = {}
        text = output.lower()

        # 1. Reasoning markers
        reasoning_hits = [m for m in self.reasoning_markers if m in text]
        signals["reasoning_hits"] = reasoning_hits

        # 2. Weak reasoning markers
        weak_hits = [m for m in self.weak_markers if m in text]
        signals["weak_hits"] = weak_hits

        # 3. Step structure heuristic
        step_markers = ["1.", "2.", "3.", "- ", "* "]
        step_hits = [m for m in step_markers if m in output]
        signals["step_hits"] = step_hits

        # 4. Length heuristic
        long_enough = len(output.strip()) > 25
        signals["long_enough"] = long_enough

        # Compute score
        score = (
            min(len(reasoning_hits), 5) * 0.15 +
            min(len(step_hits), 5) * 0.15 +
            (0.2 if long_enough else 0.0) -
            min(len(weak_hits), 5) * 0.1
        )

        score = max(0.0, min(1.0, score))
        reasoned = score >= 0.5

        reasoning = (
            f"reasoning_hits={len(reasoning_hits)}, "
            f"weak_hits={len(weak_hits)}, "
            f"step_hits={len(step_hits)}, "
            f"long_enough={long_enough}"
        )

        return ReasoningResult(
            reasoned=reasoned,
            score=score,
            reasoning=reasoning,
            signals=signals
        )

reasoning_engine = MicroReasoningEngine()
