from pydantic import BaseModel
from typing import Dict, Any

class StyleResult(BaseModel):
    stylistically_correct: bool
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroStyleEngine:
    """
    Evaluates tone, clarity, structure, and formatting style of AI output.
    """

    def __init__(self):
        # Basic tone markers (expandable later)
        self.formal_markers = ["therefore", "thus", "however", "in conclusion"]
        self.casual_markers = ["like", "basically", "kinda", "sort of"]
        self.professional_markers = ["deliverable", "objective", "scope", "timeline"]

    async def evaluate(self, output: str) -> StyleResult:
        signals = {}

        text = output.strip().lower()

        # 1. Sentence structure heuristic
        sentences = [s for s in text.split(".") if s.strip()]
        sentence_count = len(sentences)
        signals["sentence_count"] = sentence_count

        # 2. Formatting heuristic
        formatted = (
            "\n" in output
            or "-" in output
            or ":" in output
            or "*" in output
        )
        signals["formatted"] = formatted

        # 3. Tone markers
        formal_hits = [m for m in self.formal_markers if m in text]
        casual_hits = [m for m in self.casual_markers if m in text]
        professional_hits = [m for m in self.professional_markers if m in text]

        signals["formal_hits"] = formal_hits
        signals["casual_hits"] = casual_hits
        signals["professional_hits"] = professional_hits

        # 4. Clarity heuristic
        clarity = 1.0 if sentence_count >= 2 else 0.4
        signals["clarity"] = clarity

        # Compute score
        score = (
            clarity * 0.4 +
            (0.2 if formatted else 0.0) +
            (min(len(professional_hits), 3) * 0.1) +
            (min(len(formal_hits), 3) * 0.1) -
            (min(len(casual_hits), 3) * 0.1)
        )

        score = max(0.0, min(1.0, score))
        stylistically_correct = score >= 0.5

        reasoning = (
            f"sentences={sentence_count}, formatted={formatted}, "
            f"formal={len(formal_hits)}, casual={len(casual_hits)}, "
            f"professional={len(professional_hits)}, clarity={clarity:.2f}"
        )

        return StyleResult(
            stylistically_correct=stylistically_correct,
            score=score,
            reasoning=reasoning,
            signals=signals
        )

style_engine = MicroStyleEngine()
