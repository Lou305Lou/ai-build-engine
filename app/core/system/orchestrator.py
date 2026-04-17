from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional

from app.core.engines import (
    MicroConfidenceEngine,
    MicroExecutionEngine,
    MicroMemoryEngine,
    MicroPlanningEngine,
)
from app.core.engines.micro_confidence import ConfidenceResult
from app.core.engines.micro_planning import PlanResult
from app.core.engines.micro_execution import ExecutionRequest, ExecutionResult


@dataclass
class OrchestratorResult:
    prompt: str
    plan: PlanResult
    confidence: ConfidenceResult
    execution: Optional[ExecutionResult]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "prompt": self.prompt,
            "plan": self.plan.to_dict(),
            "confidence": self.confidence.to_dict(),
            "execution": self.execution.to_dict() if self.execution else None,
        }


class SystemOrchestrator:
    """
    High-level orchestrator:
    - Planning → Confidence → (optional) Execution
    """

    def __init__(
        self,
        planning_engine: MicroPlanningEngine,
        confidence_engine: MicroConfidenceEngine,
        execution_engine: Optional[MicroExecutionEngine] = None,
        memory_engine: Optional[MicroMemoryEngine] = None,
    ) -> None:
        self._planning = planning_engine
        self._confidence = confidence_engine
        self._execution = execution_engine
        self._memory = memory_engine

    def run(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
        auto_execute: bool = True,
    ) -> OrchestratorResult:
        context = context or {}

        # 1) Plan
        plan = self._planning.create_plan(prompt)

        # 2) Confidence
        confidence = self._confidence.score_candidate(
            prompt=prompt,
            plan=plan.raw_text,
            context_signals=context.get("confidence_signals") or {},
        )

        # Optional: store in memory
        if self._memory is not None:
            self._memory.set(
                key=f"last_run:{prompt[:64]}",
                value={
                    "prompt": prompt,
                    "plan": plan.to_dict(),
                    "confidence": confidence.to_dict(),
                },
                tags=["last_run", "orchestrator"],
            )

        # 3) Execution (optional)
        execution: Optional[ExecutionResult] = None
        if auto_execute and self._execution is not None:
            exec_request = ExecutionRequest(
                prompt=prompt,
                plan_text=plan.raw_text,
                context=context,
            )
            execution = self._execution.run(exec_request)

        return OrchestratorResult(
            prompt=prompt,
            plan=plan,
            confidence=confidence,
            execution=execution,
        )
