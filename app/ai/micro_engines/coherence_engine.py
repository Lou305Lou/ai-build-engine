from pydantic import BaseModel
from typing import Dict, Any

class CoherenceResult(BaseModel):
    coherent: bool
    score: float
    reasoning: str
    signals: Dict[str, Any]

class MicroCoherenceEngine:
    """
    Evaluates logical coherence and internal consistency of AI output.
    """

    def __init__(self):
        pass

    async def evaluate(self, output: str) -> CoherenceResult:
        signals = {}

        text = output.strip()

        # 1. Basic length check
        long_enough = len(text) > 20
        signals["long_enough"] = long_enough

        # 2. Sentence count
        sentences = [s for s in text.split(".") if s.strip()]
        sentence_count = len(sentences)
        signals["sentence_count"] = sentence_count

        # 3. Contradiction heuristic
        contradiction_keywords = [
            ("yes", "no"),
            ("true", "false"),
            ("always", "never"),
            ("increase", "decrease"),
        ]

        contradictions = []
        lower = text.lower()

        for a, b in contradiction_keywords:
            if a in lower and b in lower:
                contradictions.append((a, b))

        signals["contradictions"] = contradictions

        # 4. Flow heuristic (presence of connectors)
        connectors = ["therefore", "because", "however", "then", "so", "thus"]
        flow_hits = [c for c in connectors if c in lower]
        signals["flow_hits"] = flow_hits

        # Compute score
        contradiction_penalty = len(contradictions) * 0.3
        flow_bonus = min(len(flow_hits), 3) * 0.1

        base_score = 0.5
        base_score += 0.2 if long_enough else -0.2
        base_score += 0.1 if sentence_count >= 2 else -0.1
        base_score += flow_bonus
        base_score -= contradiction_penalty

        score = max(0.0, min(1.0, base_score))
        coherent = score >= 0.5

        reasoning = (
            f"sentences={sentence_count}, contradictions={len(contradictions)}, "
            f"flow_hits={len(flow_hits)}, long_enough={long_enough}"
        )

        return CoherenceResult(
            coherent=coherent,
            score=score,
            reasoning=reasoning,
            signals=signals
        )

coherence_engine = MicroCoherenceEngine()
