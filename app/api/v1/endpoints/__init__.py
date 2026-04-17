from .ai import router as ai_router
from .auth import router as auth_router
from .protected import router as protected_router
from .system import router as system_router
from .user import router as user_router
from .ai_runtime import router as ai_runtime_router
from .ai_runtime_stream import router as ai_runtime_stream_router

__all__ = [
    "ai_router",
    "auth_router",
    "protected_router",
    "system_router",
    "user_router",
    "ai_runtime_router",
    "ai_runtime_stream_router",
]
