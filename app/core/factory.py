from __future__ import annotations

from typing import Any, Dict, Callable

from app.core.runtime import RuntimeEngine


def default_llm_executor(prompt: str, context: Dict[str, Any]) -> str:
    """
    Placeholder LLM executor.
    Later, this will call Qwen or another model.
    For now, it just echoes the prompt.
    """
    return f"[LLM EXECUTOR PLACEHOLDER] Prompt: {prompt}"


def create_runtime_engine(
    llm_executor: Callable[[str, Dict[str, Any]], Any] | None = None,
) -> RuntimeEngine:
    executor = llm_executor or default_llm_executor
    return RuntimeEngine(llm_executor=executor)
