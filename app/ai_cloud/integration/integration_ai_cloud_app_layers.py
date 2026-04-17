from typing import Dict, Any
from app.ai_cloud.ai_cloud_app import ai_cloud_app

async def run_hyper_with_layers(layers: Dict[str, Any]):
    return await ai_cloud_app.run_hyper_phase(**layers)
