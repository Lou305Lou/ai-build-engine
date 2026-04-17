from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class ConfidenceSignal:
    name: str
    score: float
    weight: float = 1.0

    def weighted(self) -> float:
        return self.score * self.weight


@dataclass
class ConfidenceResult:
    total_score: float
    normalized_score: float
    label: str
    signals: List[ConfidenceSignal]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "total_score": self.total_score,
            "normalized_score": self.normalized_score,
            "label": self.label,
            "signals": [
                {
                    "name": s.name,
                    "score": s.score,
                    "weight": s.weight,
                    "weighted": s.weighted(),
                }
                for s in self.signals
            ],
        }


class MicroConfidenceEngine:
    """
    Hybrid confidence engine:
    - Deterministic rules (prompt/plan structure)
    - Probabilistic-style context signals (0–1 scaled)
    """

    def __init__(
        self,
        min_score: float = 0.0,
        max_score: float = 100.0,
        low_threshold: float = 0.35,
        medium_threshold: float = 0.65,
    ) -> None:
        self.min_score = min_score
        self.max_score = max_score
        self.low_threshold = low_threshold
        self.medium_threshold = medium_threshold

    def score_candidate(
        self,
        prompt: str,
        plan: str | None = None,
        context_signals: Dict[str, Any] | None = None,
    ) -> ConfidenceResult:
        context_signals = context_signals or {}
        signals: List[ConfidenceSignal] = []

        # Deterministic signals
        signals.append(self._signal_prompt_length(prompt))
        signals.append(self._signal_plan_structure(plan))
        signals.append(self._signal_plan_goals(plan))
        signals.append(self._signal_plan_steps(plan))

        # Context signals (0–1 scaled)
        signals.extend(self._context_signals(context_signals))

        total_weighted = sum(s.weighted() for s in signals)
        total_weight = sum(s.weight for s in signals) or 1.0

        raw_score = total_weighted / total_weight
        clamped = max(self.min_score, min(self.max_score, raw_score))
        normalized_01 = (clamped - self.min_score) / (self.max_score - self.min_score)
        label = self._label_from_score(normalized_01)

        return ConfidenceResult(
            total_score=clamped,
            normalized_score=normalized_01,
            label=label,
            signals=signals,
        )

    # ----------------- deterministic signals -----------------

    def _signal_prompt_length(self, prompt: str) -> ConfidenceSignal:
        length = len(prompt.strip())
        if length == 0:
            return ConfidenceSignal("prompt_length", 5.0, weight=2.0)
        if length < 40:
            return ConfidenceSignal("prompt_length", 35.0, weight=1.5)
        if length < 200:
            return ConfidenceSignal("prompt_length", 75.0, weight=1.5)
        if length < 800:
            return ConfidenceSignal("prompt_length", 90.0, weight=1.2)
        return ConfidenceSignal("prompt_length", 70.0, weight=1.0)

    def _signal_plan_structure(self, plan: str | None) -> ConfidenceSignal:
        if not plan:
            return ConfidenceSignal("plan_structure", 25.0, weight=1.5)

        text = plan.lower()
        has_bullets = any(b in text for b in ["- ", "* ", "1.", "2.", "3."])
        has_sections = any(k in text for k in ["step", "phase", "task", "goal"])

        if has_bullets and has_sections:
            return ConfidenceSignal("plan_structure", 85.0, weight=1.8)
        if has_bullets or has_sections:
            return ConfidenceSignal("plan_structure", 65.0, weight=1.5)
        return ConfidenceSignal("plan_structure", 45.0, weight=1.2)

    def _signal_plan_goals(self, plan: str | None) -> ConfidenceSignal:
        if not plan:
            return ConfidenceSignal("plan_goals", 30.0, weight=1.2)

        text = plan.lower()
        has_goal_words = any(
            k in text
            for k in ["goal", "objective", "outcome", "deliverable", "result", "finish"]
        )

        if has_goal_words:
            return ConfidenceSignal("plan_goals", 80.0, weight=1.4)
        return ConfidenceSignal("plan_goals", 55.0, weight=1.1)

    def _signal_plan_steps(self, plan: str | None) -> ConfidenceSignal:
        if not plan:
            return ConfidenceSignal("plan_steps", 30.0, weight=1.2)

        text = plan.lower()
        has_step_words = any(
            k in text for k in ["step", "then", "next", "after that", "finally"]
        )

        if has_step_words:
            return ConfidenceSignal("plan_steps", 80.0, weight=1.4)
        return ConfidenceSignal("plan_steps", 50.0, weight=1.1)

    # ----------------- context / probabilistic signals -----------------

    def _context_signals(self, ctx: Dict[str, Any]) -> List[ConfidenceSignal]:
        signals: List[ConfidenceSignal] = []

        model_conf = ctx.get("model_confidence")
        if isinstance(model_conf, (int, float)):
            signals.append(
                ConfidenceSignal(
                    "model_confidence",
                    float(model_conf) * 100.0,
                    weight=2.0,
                )
            )

        retrieval_quality = ctx.get("retrieval_quality")
        if isinstance(retrieval_quality, (int, float)):
            signals.append(
                ConfidenceSignal(
                    "retrieval_quality",
                    float(retrieval_quality) * 100.0,
                    weight=1.5,
                )
            )

        historical_success = ctx.get("historical_success_rate")
        if isinstance(historical_success, (int, float)):
            signals.append(
                ConfidenceSignal(
                    "historical_success_rate",
                    float(historical_success) * 100.0,
                    weight=1.3,
                )
            )

        risk_flag = ctx.get("high_risk")
        if isinstance(risk_flag, bool):
            if risk_flag:
                signals.append(
                    ConfidenceSignal(
                        "risk_penalty",
                        25.0,
                        weight=2.0,
                    )
                )
            else:
                signals.append(
                    ConfidenceSignal(
                        "risk_penalty",
                        80.0,
                        weight=1.5,
                    )
                )

        return signals

    # ----------------- labeling -----------------

    def _label_from_score(self, normalized_01: float) -> str:
        if normalized_01 < self.low_threshold:
            return "low"
        if normalized_01 < self.medium_threshold:
            return "medium"
        return "high"
