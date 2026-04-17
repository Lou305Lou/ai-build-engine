from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Any, Dict, Optional, AsyncGenerator

from app.core.factory import create_runtime_engine
from app.api.deps.auth import get_current_user


router = APIRouter()


class RuntimeStreamRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None
    auto_execute: bool = True


async def stream_runtime_output(
    prompt: str,
    context: Optional[Dict[str, Any]],
    auto_execute: bool,
) -> AsyncGenerator[str, None]:
    engine = create_runtime_engine()

    # Planning phase
    plan = engine.planning_engine.plan(prompt, context)
    yield f"EVENT:PLAN\n{plan.to_json()}\n\n"

    # Confidence phase
    confidence = engine.confidence_engine.evaluate(prompt, plan)
    yield f"EVENT:CONFIDENCE\n{confidence.to_json()}\n\n"

    # Execution phase (optional)
    if auto_execute:
        execution = engine.execution_engine.execute(prompt, plan)
        yield f"EVENT:EXECUTION\n{execution.to_json()}\n\n"

    yield "EVENT:END\n{}\n\n"


@router.post("/run/stream")
async def run_ai_runtime_stream(
    payload: RuntimeStreamRequest,
    user=Depends(get_current_user),
):
    generator = stream_runtime_output(
        prompt=payload.prompt,
        context=payload.context,
        auto_execute=payload.auto_execute,
    )
    return StreamingResponse(generator, media_type="text/event-stream")
