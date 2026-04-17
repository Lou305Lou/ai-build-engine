from pydantic import BaseModel
from typing import Dict, Any
import re

class FactualityResult(BaseModel):
    factual: bool
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroFactualityEngine:
    """
    Evaluates factual likelihood using heuristic signals.
    """

    def __init__(self):
        # Patterns that often indicate factual statements
        self.numeric_patterns = [
            r"\b\d{1,4}\b",          # numbers
            r"\b\d{1,2}%\b",         # percentages
            r"\b\d{4}-\d{4}\b",      # year ranges
        ]

        # Words that often indicate factual grounding
        self.factual_markers = [
            "according to",
            "data shows",
            "research indicates",
            "studies show",
            "evidence",
            "measured",
            "reported",
        ]

        # Words that often indicate speculation
        self.speculative_markers = [
            "maybe",
            "possibly",
            "might",
            "could be",
            "i think",
            "i guess",
            "probably",
        ]

    async def evaluate(self, output: str) -> FactualityResult:
        signals = {}
        text = output.lower()

        # 1. Numeric evidence
        numeric_hits = []
        for pattern in self.numeric_patterns:
            numeric_hits.extend(re.findall(pattern, text))
        signals["numeric_hits"] = numeric_hits

        # 2. Factual markers
        factual_hits = [m for m in self.factual_markers if m in text]
        signals["factual_hits"] = factual_hits

        # 3. Speculative markers
        speculative_hits = [m for m in self.speculative_markers if m in text]
        signals["speculative_hits"] = speculative_hits

        # 4. Length heuristic
        long_enough = len(output.strip()) > 25
        signals["long_enough"] = long_enough

        # Compute score
        score = (
            min(len(numeric_hits), 5) * 0.1 +
            min(len(factual_hits), 5) * 0.15 +
            (0.2 if long_enough else 0.0) -
            min(len(speculative_hits), 5) * 0.1
        )

        score = max(0.0, min(1.0, score))
        factual = score >= 0.5

        reasoning = (
            f"numeric={len(numeric_hits)}, factual={len(factual_hits)}, "
            f"speculative={len(speculative_hits)}, long_enough={long_enough}"
        )

        return FactualityResult(
            factual=factual,
            score=score,
            reasoning=reasoning,
            signals=signals
        )

factuality_engine = MicroFactualityEngine()
