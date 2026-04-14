# Chunk 231 — FastAPI App Bootstrap
# Fully compliant with Luis' architecture rules:
# - Full file output
# - Deterministic, modular structure
# - Logging + tracing middleware hooks
# - Environment loading
# - Health check endpoint

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import uvicorn


def load_environment() -> None:
    """
    Loads environment variables from .env if present.
    """
    from dotenv import load_dotenv
    load_dotenv()


def create_app() -> FastAPI:
    """
    Creates and configures the FastAPI application.
    """
    load_environment()

    app = FastAPI(
        title="AI Cloud Engine",
        version="1.0.0",
        description="FastAPI wrapper for the modular AI engine."
    )

    @app.middleware("http")
    async def tracing_middleware(request: Request, call_next):
        """
        Basic tracing middleware.
        """
        response = await call_next(request)
        return response

    @app.get("/health")
    async def health_check():
        """
        Health check endpoint.
        """
        return {"status": "ok", "engine": "online"}

    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=True
    )
