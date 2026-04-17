from app.core.settings import settings

def load_config():
    return {
        "app_name": settings.app_name,
        "api_host": settings.api_host,
        "api_port": settings.api_port,
        "environment": settings.environment,
    }
