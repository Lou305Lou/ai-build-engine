from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.api.v1.system.db_init import router as db_init_router

router = APIRouter()

# ---------------------------------------------------------
# SYSTEM STATUS
# ---------------------------------------------------------
@router.get("/status")
async def system_status():
    return {"status": "ok"}

@router.get("/health")
async def system_health():
    return {"health": "ok"}

# ---------------------------------------------------------
# DATABASE STATUS
# ---------------------------------------------------------
@router.get("/db/status")
async def database_status(db: AsyncSession = Depends(get_session)):
    try:
        await db.execute("SELECT 1")
        return {"database": "connected"}
    except Exception:
        return {"database": "error"}

# ---------------------------------------------------------
# INCLUDE DB INIT ROUTER
# ---------------------------------------------------------
router.include_router(db_init_router, prefix="/db")
