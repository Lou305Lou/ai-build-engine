# Chunk 234 — API Routes (v1/ai/safe-complete)
# Fully compliant with Luis' architecture rules:
# - Full file output
# - Deterministic async API routes
# - Integrates EngineIntegration (Chunk 233)
# - Structured envelopes
# - No magic numbers

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

from api.engine_integration import EngineIntegration


router = APIRouter(prefix="/v1/ai", tags=["AI"])


class CompletionRequest(BaseModel):
    prompt: str


class CompletionResponse(BaseModel):
    error: bool
    engine_output: Dict[str, Any]
    version: str


engine = EngineIntegration()


@router.post("/safe-complete", response_model=CompletionResponse)
async def safe_complete(request: CompletionRequest) -> CompletionResponse:
    """
    Main inference endpoint.
    Executes the full engine pipeline.
    """
    result = await engine.run(request.prompt)

    return CompletionResponse(
        error=result.get("error", False),
        engine_output=result.get("engine_output", {}),
        version=result.get("version", "1.0.0")
    )
