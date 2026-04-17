from pydantic import BaseModel
from typing import Dict, Any

class SafetyResult(BaseModel):
    safe: bool
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroSafetyEngine:
    """
    Evaluates AI output for unsafe or disallowed content.
    """

    def __init__(self):
        # Simple keyword lists (expandable later)
        self.violence_keywords = [
            "kill", "hurt", "attack", "destroy", "violence", "weapon"
        ]
        self.self_harm_keywords = [
            "suicide", "self-harm", "kill myself", "end my life"
        ]
        self.illegal_keywords = [
            "hack", "steal", "fraud", "drugs", "exploit"
        ]
        self.hate_keywords = [
            "hate", "racist", "bigot", "slur"
        ]

    async def evaluate(self, output: str) -> SafetyResult:
        signals = {}

        text = output.lower()

        # 1. Violence detection
        violence_hits = [k for k in self.violence_keywords if k in text]
        signals["violence_hits"] = violence_hits

        # 2. Self-harm detection
        self_harm_hits = [k for k in self.self_harm_keywords if k in text]
        signals["self_harm_hits"] = self_harm_hits

        # 3. Illegal activity detection
        illegal_hits = [k for k in self.illegal_keywords if k in text]
        signals["illegal_hits"] = illegal_hits

        # 4. Hate speech detection
        hate_hits = [k for k in self.hate_keywords if k in text]
        signals["hate_hits"] = hate_hits

        # Compute risk score
        total_hits = (
            len(violence_hits)
            + len(self_harm_hits)
            + len(illegal_hits)
            + len(hate_hits)
        )

        # Score: 1.0 = fully safe, 0.0 = unsafe
        score = max(0.0, 1.0 - (total_hits * 0.25))
        safe = score >= 0.75

        reasoning = (
            f"violence={len(violence_hits)}, "
            f"self_harm={len(self_harm_hits)}, "
            f"illegal={len(illegal_hits)}, "
            f"hate={len(hate_hits)}"
        )

        return SafetyResult(
            safe=safe,
            score=score,
            reasoning=reasoning,
            signals=signals
        )

safety_engine = MicroSafetyEngine()
