from app.core.version import APP_VERSION
from app.core.settings import settings

def get_system_state():
    return {
        "version": APP_VERSION,
        "environment": settings.environment,
        "app_name": settings.app_name,
    }
