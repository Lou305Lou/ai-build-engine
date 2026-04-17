from pydantic import BaseModel
from typing import Dict, Any

class MetaStyleResult(BaseModel):
    meta_style_score: float
    label: str
    reasoning: str
    macro_signals: Dict[str, Any]

class MetaStyleEngine:
    async def evaluate(self, macro_results: Dict[str, Any]) -> MetaStyleResult:
        style = macro_results["style"]
        score = style["score"]

        meta_score = max(0.0, min(1.0, score))

        label = "meta-styled" if meta_score >= 0.6 else "meta-unstyled"

        reasoning = f"macro_style={score:.2f}"

        return MetaStyleResult(
            meta_style_score=meta_score,
            label=label,
            reasoning=reasoning,
            macro_signals=macro_results
        )

meta_style_engine = MetaStyleEngine()
