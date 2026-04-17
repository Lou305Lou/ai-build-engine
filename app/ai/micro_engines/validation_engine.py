from pydantic import BaseModel
from typing import Dict, Any

class ValidationResult(BaseModel):
    valid: bool
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroValidationEngine:
    """
    Validates whether an AI output follows instructions and expected structure.
    """

    def __init__(self):
        pass

    async def validate(self, instruction: str, output: str) -> ValidationResult:
        signals = {}

        # 1. Output exists
        exists = len(output.strip()) > 0
        signals["exists"] = exists

        # 2. Basic instruction keyword overlap
        instruction_words = set(instruction.lower().split())
        output_words = set(output.lower().split())
        overlap = len(instruction_words & output_words)
        signals["keyword_overlap"] = overlap

        # 3. Structure heuristic
        structured = (
            "\n" in output
            or ":" in output
            or "-" in output
            or "{" in output
            or "}" in output
        )
        signals["structured"] = structured

        # 4. Completeness heuristic
        completeness = 1.0 if len(output) > 20 else 0.3
        signals["completeness"] = completeness

        # Weighted score
        score = (
            (1.0 if exists else 0.0) * 0.25 +
            (min(overlap, 5) / 5) * 0.25 +
            (1.0 if structured else 0.3) * 0.25 +
            completeness * 0.25
        )

        score = max(0.0, min(1.0, score))
        valid = score >= 0.5

        reasoning = (
            f"exists={exists}, overlap={overlap}, "
            f"structured={structured}, completeness={completeness:.2f}"
        )

        return ValidationResult(
            valid=valid,
            score=score,
            reasoning=reasoning,
            signals=signals
        )

validation_engine = MicroValidationEngine()
