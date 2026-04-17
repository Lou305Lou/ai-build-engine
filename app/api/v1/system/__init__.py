from fastapi import APIRouter

router = APIRouter()

# Import sub-routers
from .db_init import router as db_init_router

# Mount sub-routers
router.include_router(db_init_router, prefix="/db")
