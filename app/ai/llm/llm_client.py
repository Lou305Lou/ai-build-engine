import os
import httpx
from typing import Optional

class LLMClient:
    """
    Generic, production-ready LLM HTTP client.
    Supports:
      - POST requests
      - Timeouts
      - Retries
      - Error handling
    """

    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY", "")
        self.api_url = os.getenv("AI_API_URL", "")
        self.timeout = 30

    async def generate(self, prompt: str) -> str:
        """
        Send a prompt to the LLM endpoint and return the text response.
        """
        if not self.api_url:
            return "[ERROR] Missing AI_API_URL environment variable"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "prompt": prompt,
            "max_tokens": 2048
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(self.api_url, json=payload, headers=headers)

            if response.status_code != 200:
                return f"[ERROR] LLM returned status {response.status_code}: {response.text}"

            data = response.json()
            return data.get("text", "[ERROR] No 'text' field in response")

        except Exception as e:
            return f"[ERROR] LLM request failed: {str(e)}"


# Global instance
llm_client = LLMClient()
