from __future__ import annotations

from typing import Any, Dict, Optional, Callable

from app.core.engines import (
    MicroConfidenceEngine,
    MicroExecutionEngine,
    MicroMemoryEngine,
    MicroPlanningEngine,
)
from app.core.system.orchestrator import SystemOrchestrator, OrchestratorResult


class RuntimeEngine:
    """
    Top-level runtime:
    - Owns micro-engines
    - Exposes a single `run` entrypoint for the rest of the app
    """

    def __init__(self, llm_executor: Callable[[str, Dict[str, Any]], Any]) -> None:
        self._planning = MicroPlanningEngine()
        self._confidence = MicroConfidenceEngine()
        self._memory = MicroMemoryEngine()
        self._execution = MicroExecutionEngine(executor=llm_executor)

        self._orchestrator = SystemOrchestrator(
            planning_engine=self._planning,
            confidence_engine=self._confidence,
            execution_engine=self._execution,
            memory_engine=self._memory,
        )

    def run(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
        auto_execute: bool = True,
    ) -> OrchestratorResult:
        return self._orchestrator.run(
            prompt=prompt,
            context=context,
            auto_execute=auto_execute,
        )

    # Optional helpers for future use
    @property
    def planning_engine(self) -> MicroPlanningEngine:
        return self._planning

    @property
    def confidence_engine(self) -> MicroConfidenceEngine:
        return self._confidence

    @property
    def memory_engine(self) -> MicroMemoryEngine:
        return self._memory

    @property
    def execution_engine(self) -> MicroExecutionEngine:
        return self._execution
