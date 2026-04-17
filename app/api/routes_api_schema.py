from __future__ import annotations

from typing import Any, Dict

from app.core.system_api_schema import SYSTEM_API_SCHEMA as BASE_SYSTEM_API_SCHEMA


SYSTEM_API_SCHEMA: Dict[str, Dict[str, Any]] = dict(BASE_SYSTEM_API_SCHEMA)

SYSTEM_API_SCHEMA.update(
    {
        "ai_runtime_run": {
            "method": "POST",
            "path": "/api/v1/ai/run",
            "description": "Execute the Micro-Engine Runtime pipeline (plan → confidence → execution).",
            "request_model": "RuntimeRequest",
            "response_model": "RuntimeResponse",
        },
        "ai_runtime_stream": {
            "method": "POST",
            "path": "/api/v1/ai/run/stream",
            "description": "Stream Micro-Engine Runtime events (plan → confidence → execution).",
            "request_model": "RuntimeStreamRequest",
            "response_model": "StreamingResponse",
        },
    }
)
