# API entrypoint that simply exposes the main FastAPI app.
# This avoids duplicate app definitions and keeps app.main as the single source of truth.

from app.main import app
