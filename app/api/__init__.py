from fastapi import FastAPI
from app.api.v1.api import api_router as v1_router

def init_api(app: FastAPI):
    app.include_router(v1_router, prefix="/api/v1")
