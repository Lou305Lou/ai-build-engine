# Chunk 235 — API Routes (v1/ai/build-engine)
# Fully compliant with Luis' architecture rules:
# - Full file output
# - Deterministic async API routes
# - Uses EngineIntegration to generate structured build outputs
# - No magic numbers

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

from api.engine_integration import EngineIntegration


router = APIRouter(prefix="/v1/ai", tags=["Builder"])


class BuildRequest(BaseModel):
    spec: str


class BuildResponse(BaseModel):
    error: bool
    engine_output: Dict[str, Any]
    version: str


engine = EngineIntegration()


@router.post("/build-engine", response_model=BuildResponse)
async def build_engine(request: BuildRequest) -> BuildResponse:
    """
    Build engine endpoint.
    Uses the full engine pipeline to generate structured build outputs.
    """
    result = await engine.run(request.spec)

    return BuildResponse(
        error=result.get("error", False),
        engine_output=result.get("engine_output", {}),
        version=result.get("version", "1.0.0")
    )
