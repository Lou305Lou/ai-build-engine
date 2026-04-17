from fastapi import APIRouter
from app.metrics.metrics_core import metrics_core

router = APIRouter()

@router.get("/all")
async def all_metrics():
    return metrics_core.collect()
