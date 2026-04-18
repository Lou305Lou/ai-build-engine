from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api_app import v1_router as root_api_router
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

    # Users router
    from app.api.v1.endpoints.users import router as users_router
    app.include_router(users_router, prefix="/api/v1/users", tags=["users"])

    # --- OPENAPI OVERRIDE (FORCE REBUILD) ---
    from fastapi.openapi.utils import get_openapi

    def custom_openapi():
        # ALWAYS rebuild schema (fixes Swagger caching)
        openapi_schema = get_openapi(
            title="AI Cloud App",
            version="1.0.0",
            description="AI Cloud App API",
            routes=app.routes,
        )

        # Inject BearerAuth
        openapi_schema.setdefault("components", {}).setdefault("securitySchemes", {})
        openapi_schema["components"]["securitySchemes"]["BearerAuth"] = {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }

        # Apply BearerAuth globally
        for path in openapi_schema.get("paths", {}).values():
            for method in path.values():
                method.setdefault("security", []).append({"BearerAuth": []})

        return openapi_schema

    app.openapi = custom_openapi
    # --- END OPENAPI OVERRIDE ---

    return app


app = create_app()
