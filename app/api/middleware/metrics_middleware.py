from starlette.middleware.base import BaseHTTPMiddleware
from app.metrics.metrics_collector import metrics_collector

class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        metrics_collector.record("request_total", 1)
        return response
