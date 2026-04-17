from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.protected import router as protected_router
from app.api.v1.endpoints.system import router as system_router
from app.api.v1.endpoints.users import router as users_router

# ADD COMMANDS ROUTER
from app.api.routes.routes_commands import router as commands_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(protected_router, prefix="/protected", tags=["protected"])
api_router.include_router(system_router, prefix="/system", tags=["system"])
api_router.include_router(users_router, prefix="/users", tags=["users"])

# MOUNT COMMANDS
api_router.include_router(commands_router, prefix="/commands", tags=["commands"])

