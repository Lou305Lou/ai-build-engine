from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Any, Dict, Optional

from app.core.factory import create_runtime_engine
from app.api.deps.auth import get_current_user


router = APIRouter()


class RuntimeRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None
    auto_execute: bool = True


class RuntimeResponse(BaseModel):
    prompt: str
    plan: Dict[str, Any]
    confidence: Dict[str, Any]
    execution: Optional[Dict[str, Any]] = None


@router.post("/run", response_model=RuntimeResponse)
def run_ai_runtime(
    payload: RuntimeRequest,
    user=Depends(get_current_user),
):
    engine = create_runtime_engine()
    result = engine.run(
        prompt=payload.prompt,
        context=payload.context,
        auto_execute=payload.auto_execute,
    )
    return RuntimeResponse(
        prompt=result.prompt,
        plan=result.plan.to_dict(),
        confidence=result.confidence.to_dict(),
        execution=result.execution.to_dict() if result.execution else None,
    )
