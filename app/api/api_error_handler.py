from fastapi import Request
from fastapi.responses import JSONResponse

from app.ai_cloud.ai_cloud_errors import AICloudError

async def ai_cloud_error_handler(request: Request, exc: AICloudError):
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": str(exc)},
    )
