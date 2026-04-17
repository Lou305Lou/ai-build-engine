from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class PlanStep:
    index: int
    description: str


@dataclass
class PlanResult:
    raw_text: str
    steps: List[PlanStep]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "raw_text": self.raw_text,
            "steps": [
                {"index": s.index, "description": s.description} for s in self.steps
            ],
        }


class MicroPlanningEngine:
    """
    Simple planning engine:
    - Takes a goal/prompt
    - Produces a linear list of steps
    """

    def create_plan(self, goal: str) -> PlanResult:
        goal = goal.strip()
        if not goal:
            return PlanResult(raw_text="", steps=[])

        # Minimal heuristic: break into 3 generic steps
        steps = [
            PlanStep(index=1, description=f"Understand the goal: {goal}"),
            PlanStep(index=2, description="Identify required inputs, tools, and context."),
            PlanStep(index=3, description="Execute the plan and validate the result."),
        ]

        raw_text = "\n".join(f"{s.index}. {s.description}" for s in steps)
        return PlanResult(raw_text=raw_text, steps=steps)
