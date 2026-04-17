from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api_app import api_router as root_api_router
from app.api.v1.api import api_router as v1_api_router
from app.core.logging_config import configure_logging


def create_app() -> FastAPI:
    configure_logging()

    app = FastAPI(
        title="AI Cloud App",
        openapi_url="/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Root API (system endpoints)
    app.include_router(root_api_router, prefix="/api")

    # Versioned API (v1)
    app.include_router(v1_api_router, prefix="/api/v1")

    return app


app = create_app()
from app.api.v1.endpoints.users import router as users_router
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])
