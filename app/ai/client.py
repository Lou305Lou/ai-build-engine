from app.ai.llm.llm_client import llm_client
from app.ai.llm.llm_stream_client import llm_stream_client

class AIModelClient:
    """
    Unified interface for both standard and streaming AI calls.
    """

    async def generate(self, prompt: str) -> str:
        return await llm_client.generate(prompt)

    async def stream(self, prompt: str):
        async for chunk in llm_stream_client.stream(prompt):
            yield chunk


# Global instance
ai_model_client = AIModelClient()

