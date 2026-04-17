from fastapi import APIRouter
from app.api.routes import routes_commands

router = APIRouter()

router.include_router(
    routes_commands.router,
    prefix="/commands",
    tags=["Commands"]
)
