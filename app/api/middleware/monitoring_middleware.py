from starlette.middleware.base import BaseHTTPMiddleware
from app.monitoring.monitoring_stub import monitoring_stub

class MonitoringMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        monitoring_stub.record("request_count", 1)
        return response
