from pydantic import BaseModel
from typing import Dict, Any

class MacroStyleResult(BaseModel):
    style_score: float
    label: str
    reasoning: str
    micro_signals: Dict[str, Any]

class MacroStyleEngine:
    async def evaluate(self, micro_results: Dict[str, Any]) -> MacroStyleResult:
        style = micro_results["style"]
        score = style["score"]

        formal = len(style["signals"].get("formal_hits", []))
        casual = len(style["signals"].get("casual_hits", []))
        professional = len(style["signals"].get("professional_hits", []))

        macro_score = (
            score * 0.6 +
            min(formal, 3) * 0.05 +
            min(professional, 3) * 0.05 -
            min(casual, 3) * 0.1
        )

        macro_score = max(0.0, min(1.0, macro_score))

        label = "well‑styled" if macro_score >= 0.6 else "poorly‑styled"

        reasoning = (
            f"formal={formal}, casual={casual}, professional={professional}, base={score:.2f}"
        )

        return MacroStyleResult(
            style_score=macro_score,
            label=label,
            reasoning=reasoning,
            micro_signals=micro_results
        )

macro_style_engine = MacroStyleEngine()
