from starlette.middleware.base import BaseHTTPMiddleware
from app.core.structured_log_writer import structured_log_writer

class LogRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        structured_log_writer.write("request", {"path": request.url.path})
        return await call_next(request)
