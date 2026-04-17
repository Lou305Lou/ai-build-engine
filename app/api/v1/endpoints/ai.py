from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Any, Dict

from app.ai.command_router import ai_command_router
from app.ai.handlers.stream_ai_response import handle_stream_ai_response
from app.ai.handlers.stream_assemble_project import handle_stream_assemble_project
from app.ai.handlers.stream_patch_file import handle_stream_patch_file
from app.ai.handlers.stream_patch_region import handle_stream_patch_region
from app.ai.handlers.stream_patch_region_ast import handle_stream_patch_region_ast

router = APIRouter()


class AICommandRequest(BaseModel):
    command: str
    payload: Dict[str, Any] = {}


@router.post("/execute")
async def execute_ai_command(body: AICommandRequest):
    try:
        result = await ai_command_router.execute(body.command, body.payload)
        return {"status": "success", "result": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def stream_ai(body: AICommandRequest):
    if body.command != "stream_ai_response":
        raise HTTPException(status_code=400, detail="Only 'stream_ai_response' is supported here.")

    async def event_generator():
        async for chunk in handle_stream_ai_response(body.payload):
            yield chunk + "\n"

    return StreamingResponse(event_generator(), media_type="text/plain")


@router.post("/assemble/stream")
async def stream_assemble(body: AICommandRequest):
    if body.command != "stream_assemble_project":
        raise HTTPException(status_code=400, detail="Only 'stream_assemble_project' is supported here.")

    async def event_generator():
        async for event in handle_stream_assemble_project(body.payload):
            yield event

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/patch/stream")
async def stream_patch(body: AICommandRequest):
    if body.command != "stream_patch_file":
        raise HTTPException(status_code=400, detail="Only 'stream_patch_file' is supported here.")

    async def event_generator():
        async for event in handle_stream_patch_file(body.payload):
            yield event

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/patch-region/stream")
async def stream_patch_region(body: AICommandRequest):
    if body.command != "stream_patch_region":
        raise HTTPException(status_code=400, detail="Only 'stream_patch_region' is supported here.")

    async def event_generator():
        async for event in handle_stream_patch_region(body.payload):
            yield event

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/patch-region-ast/stream")
async def stream_patch_region_ast(body: AICommandRequest):
    if body.command != "stream_patch_region_ast":
        raise HTTPException(status_code=400, detail="Only 'stream_patch_region_ast' is supported here.")

    async def event_generator():
        async for event in handle_stream_patch_region_ast(body.payload):
            yield event

    return StreamingResponse(event_generator(), media_type="text/event-stream")
