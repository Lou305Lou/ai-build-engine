from fastapi import FastAPI
from app.ai_cloud.ai_cloud_boot import ai_cloud_boot
from app.ai_cloud.ai_cloud_startup_log import log_startup
from app.ai_cloud.ai_cloud_shutdown import shutdown

def register_lifecycle(app: FastAPI):
    @app.on_event("startup")
    async def startup_event():
        log_startup()
        await ai_cloud_boot.boot()

    @app.on_event("shutdown")
    async def shutdown_event():
        await shutdown()
