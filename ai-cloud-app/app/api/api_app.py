from fastapi import FastAPI
from app.api.v1.api import api_router as v1_router

app = FastAPI(title="AI Cloud App API")

# Mount v1 under /api/v1
app.include_router(v1_router, prefix="/api/v1")
