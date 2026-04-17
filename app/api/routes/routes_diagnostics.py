from fastapi import APIRouter
from app.diagnostics.diagnostics_aggregator import aggregate_diagnostics

router = APIRouter()

@router.get("/full")
async def full_diagnostics():
    return aggregate_diagnostics()
