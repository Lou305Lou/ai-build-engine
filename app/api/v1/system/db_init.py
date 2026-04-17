from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.db.init_db import init_db

router = APIRouter()

@router.post("/init", summary="Initialize database with default data")
async def initialize_database(db: AsyncSession = Depends(get_session)):
    try:
        await init_db(db)
        return {"status": "database initialized"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

