from pydantic import BaseModel
from typing import Dict, Any

class HyperStabilitySynthResult(BaseModel):
    synthesized_score: float
    label: str
    reasoning: str

class HyperStabilitySynthesizer:
    async def synthesize(self, hyper_scores: Dict[str, float]) -> HyperStabilitySynthResult:
        if not hyper_scores:
            score = 0.0
        else:
            score = sum(hyper_scores.values()) / len(hyper_scores)

        score = max(0.0, min(1.0, score))

        if score >= 0.85:
            label = "hyper-stable"
        elif score >= 0.60:
            label = "stable"
        else:
            label = "unstable"

        reasoning = f"synthesized={score:.2f}"

        return HyperStabilitySynthResult(
            synthesized_score=score,
            label=label,
            reasoning=reasoning
        )

hyper_stability_synthesizer = HyperStabilitySynthesizer()
