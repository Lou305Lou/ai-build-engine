from starlette.middleware.base import BaseHTTPMiddleware
from app.core.request_id_generator import generate_request_id

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request.state.request_id = generate_request_id()
        response = await call_next(request)
        response.headers["X-Request-ID"] = request.state.request_id
        return response
