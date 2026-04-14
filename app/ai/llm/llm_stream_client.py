import os
import httpx
from typing import AsyncGenerator

class LLMStreamClient:
    """
    Streaming LLM client.
    Returns an async generator that yields tokens as they arrive.
    """

    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY", "")
        self.api_url = os.getenv("AI_API_URL", "")
        self.timeout = 60

    async def stream(self, prompt: str) -> AsyncGenerator[str, None]:
        if not self.api_url:
            yield "[ERROR] Missing AI_API_URL environment variable"
            return

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "prompt": prompt,
            "stream": True,
            "max_tokens": 2048
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream("POST", self.api_url, json=payload, headers=headers) as response:
                    async for line in response.aiter_lines():
                        if line.strip():
                            yield line

        except Exception as e:
            yield f"[ERROR] Streaming failed: {str(e)}"


# Global instance
llm_stream_client = LLMStreamClient()
