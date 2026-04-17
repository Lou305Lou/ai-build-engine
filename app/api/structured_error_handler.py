from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.structured_error import structured_error

async def unified_error_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=500,
        content=structured_error(str(exc), request_id),
    )
