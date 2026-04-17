from app.ai_cloud.ai_cloud_logger import ai_cloud_logger

async def shutdown():
    ai_cloud_logger.log("AI Cloud App shutting down")
