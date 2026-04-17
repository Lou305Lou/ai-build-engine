from app.core.settings import settings

def get_system_environment():
    return {
        "environment": settings.environment,
        "host": settings.api_host,
        "port": settings.api_port
    }
