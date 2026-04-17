from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional, Callable


@dataclass
class ExecutionRequest:
    prompt: str
    plan_text: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


@dataclass
class ExecutionResult:
    output: str
    raw_response: Any

    def to_dict(self) -> Dict[str, Any]:
        return {
            "output": self.output,
            "raw_response": self.raw_response,
        }


class MicroExecutionEngine:
    """
    Thin execution layer:
    - Delegates to a callable (e.g., Qwen client)
    - Keeps interface stable for the rest of the system
    """

    def __init__(self, executor: Callable[[str, Dict[str, Any]], Any]) -> None:
        self._executor = executor

    def run(self, request: ExecutionRequest) -> ExecutionResult:
        context = request.context or {}
        response = self._executor(request.prompt, context)
        # For now, assume response is text-like
        return ExecutionResult(output=str(response), raw_response=response)
