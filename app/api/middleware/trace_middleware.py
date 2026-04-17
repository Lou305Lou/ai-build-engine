from starlette.middleware.base import BaseHTTPMiddleware
from app.core.trace_id_generator import generate_trace_id

class TraceMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request.state.trace_id = generate_trace_id()
        response = await call_next(request)
        response.headers["X-Trace-ID"] = request.state.trace_id
        return response
