from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_session
import os

router = APIRouter()

@router.get("/status")
async def system_status():
    return {
        "status": "ok",
        "message": "System operational"
    }

@router.get("/db")
async def database_status(db: AsyncSession = Depends(get_session)):
    try:
        await db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "detail": str(e)}

@router.get("/info")
async def system_info():
    return {
        "environment": os.getenv("ENV", "development"),
        "version": "1.0.0",
        "service": "AI Build Engine Backend"
    }
