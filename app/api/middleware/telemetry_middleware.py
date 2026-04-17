from starlette.middleware.base import BaseHTTPMiddleware
from app.core.telemetry_logger import telemetry_logger

class TelemetryMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        telemetry_logger.record("api_request", {"path": request.url.path})
        return response
