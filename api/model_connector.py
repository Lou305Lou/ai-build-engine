# Chunk 232 — Model Connector (Qwen via OpenRouter)
# Fully compliant with Luis' architecture rules:
# - Full file output
# - Deterministic async connector
# - Error envelopes
# - Timeout handling
# - Logging/tracing hooks
# - No magic numbers

import os
import httpx
from typing import Dict, Any, Optional


class ModelConnector:
    """
    Async connector for Qwen via OpenRouter.
    Handles timeouts, errors, and structured envelopes.
    """

    VERSION = "1.0.0"

    DEFAULT_MODEL = "qwen/qwen-2.5-72b-instruct"
    TIMEOUT_SECONDS = 30

    def __init__(self, logger: Optional[Any] = None, tracer: Optional[Any] = None):
        self.logger = logger
        self.tracer = tracer
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"

    def _log(self, message: str) -> None:
        if self.logger:
            self.logger.info(message)

    def _trace(self, label: str, payload: Dict[str, Any]) -> None:
        if self.tracer:
            self.tracer.trace(label, payload)

    async def complete(self, prompt: str, model: Optional[str] = None) -> Dict[str, Any]:
        """
        Sends a completion request to Qwen via OpenRouter.
        Returns a structured model_output dict.
        """

        chosen_model = model or self.DEFAULT_MODEL

        self._trace("model_connector_request", {
            "model": chosen_model,
            "prompt_length": len(prompt)
        })

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": chosen_model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }

        try:
            async with httpx.AsyncClient(timeout=self.TIMEOUT_SECONDS) as client:
                response = await client.post(self.base_url, json=payload, headers=headers)

            if response.status_code != 200:
                return {
                    "error": True,
                    "message": "Model API returned non-200 status.",
                    "status_code": response.status_code,
                    "details": response.text
                }

            data = response.json()

            content = (
                data.get("choices", [{}])[0]
                .get("message", {})
                .get("content", "")
            )

            self._trace("model_connector_response", {
                "model": chosen_model,
                "content_length": len(content)
            })

            return {
                "error": False,
                "content": content,
                "model": chosen_model,
                "version": self.VERSION
            }

        except Exception as e:
            self._log(f"Model connector error: {str(e)}")
            return {
                "error": True,
                "message": "Exception during model request.",
                "details": str(e)
            }
