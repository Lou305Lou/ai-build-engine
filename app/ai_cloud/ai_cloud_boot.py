import asyncio
from app.ai_cloud.ai_cloud_app import ai_cloud_app

class AICloudBoot:
    async def boot(self):
        await ai_cloud_app.load()
        return {"status": "ai-cloud-app-loaded"}

ai_cloud_boot = AICloudBoot()
