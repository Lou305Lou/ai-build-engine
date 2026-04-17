from fastapi import APIRouter

from app.api.routes.routes_system_overrides import router as system_overrides_router
# (all previous imports remain unchanged)

router = APIRouter()
# (all previous include_router calls remain unchanged)
router.include_router(system_overrides_router, prefix="/system", tags=["system"])
