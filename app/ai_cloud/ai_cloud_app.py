import asyncio
from typing import Dict, Any

from app.ai.hyper_engines.hyper_phase_orchestrator import hyper_phase_orchestrator

class AICloudApp:
    def __init__(self):
        self.loaded = False
        self.engine = None

    async def load(self):
        if self.loaded:
            return

        self.engine = hyper_phase_orchestrator
        self.loaded = True

    async def run_hyper_phase(self, **layers: Dict[str, Any]):
        if not self.loaded:
            await self.load()

        return await self.engine.run(**layers)

ai_cloud_app = AICloudApp()
