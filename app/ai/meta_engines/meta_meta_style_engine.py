from pydantic import BaseModel
from typing import Dict, Any

class MetaMetaStyleResult(BaseModel):
    score: float
    label: str
    reasoning: str
    meta_layer: Dict[str, Any]

class MetaMetaStyleEngine:
    async def evaluate(self, meta_results: Dict[str, Any]) -> MetaMetaStyleResult:
        style = meta_results["style"]["meta_style_score"]
        score = max(0.0, min(1.0, style))

        label = "meta-meta-styled" if score >= 0.6 else "meta-meta-unstyled"

        reasoning = f"meta_style={score:.2f}"

        return MetaMetaStyleResult(
            score=score,
            label=label,
            reasoning=reasoning,
            meta_layer=meta_results
        )

meta_meta_style_engine = MetaMetaStyleEngine()
