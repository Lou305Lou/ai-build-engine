from app.core.settings import settings

def get_app_info():
    return {
        "name": settings.app_name,
        "environment": settings.environment,
    }
