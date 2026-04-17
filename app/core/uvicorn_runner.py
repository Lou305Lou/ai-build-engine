import uvicorn
from app.core.settings import settings

def run_uvicorn():
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=False,
    )
