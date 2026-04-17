from pydantic import BaseModel
from typing import Optional, Dict, Any
import math

class ConfidenceResult(BaseModel):
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroConfidenceEngine:
    """
    Computes a confidence score for any AI output.
    """

    def __init__(self):
        pass

    async def evaluate(self, input_text: str, output_text: str) -> ConfidenceResult:
        signals = {}

        # 1. Length ratio signal
        input_len = len(input_text.strip())
        output_len = len(output_text.strip())
        ratio = output_len / input_len if input_len > 0 else 1
        signals["length_ratio"] = ratio

        # 2. Completeness signal
        completeness = 1.0 if output_len > 20 else 0.3
        signals["completeness"] = completeness

        # 3. Repetition signal
        unique_words = len(set(output_text.split()))
        total_words = len(output_text.split())
        repetition = 1 - (unique_words / total_words) if total_words > 0 else 0
        signals["repetition_penalty"] = repetition

        # 4. Basic hallucination heuristic
        hallucination_risk = 0.1 if "???" not in output_text else 0.6
        signals["hallucination_risk"] = hallucination_risk

        # 5. Instruction compliance heuristic
        compliance = 1.0 if len(output_text) > 0 else 0.0
        signals["instruction_compliance"] = compliance

        # Weighted score
        score = (
            (1 - repetition) * 0.25 +
            completeness * 0.25 +
            compliance * 0.25 +
            (1 - hallucination_risk) * 0.25
        )

        score = max(0.0, min(1.0, score))

        reasoning = (
            f"Score computed from repetition={repetition:.2f}, "
            f"completeness={completeness:.2f}, "
            f"compliance={compliance:.2f}, "
            f"hallucination_risk={hallucination_risk:.2f}."
        )

        return ConfidenceResult(
            score=score,
            reasoning=reasoning,
            signals=signals
        )

confidence_engine = MicroConfidenceEngine()
