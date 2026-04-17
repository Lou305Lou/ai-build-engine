from __future__ import annotations

from typing import Dict

from app.core.system_api_map import SYSTEM_API_MAP as BASE_SYSTEM_API_MAP


SYSTEM_API_MAP: Dict[str, str] = dict(BASE_SYSTEM_API_MAP)

SYSTEM_API_MAP.update(
    {
        "ai_runtime_run": "/api/v1/ai/run",
        "ai_runtime_stream": "/api/v1/ai/run/stream",
    }
)
