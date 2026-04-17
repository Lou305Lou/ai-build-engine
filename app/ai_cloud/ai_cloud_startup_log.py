from app.ai_cloud.ai_cloud_logger import ai_cloud_logger
from app.core.settings import settings

def log_startup():
    ai_cloud_logger.log(f"Starting {settings.app_name} in {settings.environment} mode")
