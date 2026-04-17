from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from app.core.rate_limit_stub import rate_limiter

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if not rate_limiter.allow("global"):
            return JSONResponse({"status": "rate_limited"}, status_code=429)
        return await call_next(request)
