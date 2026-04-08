import os
import requests


class OpenRouterClient:
    """
    Simple client to talk to OpenRouter's chat API.
    Qwen (your cloud AI) will use this under the hood.
    """

    def __init__(self, api_key: str | None = None, model: str = "qwen/qwen-2.5-72b-instruct"):
        # 1) Load API key from argument or environment variable
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OPENROUTER_API_KEY is missing. "
                "Set it in your environment or pass api_key to OpenRouterClient()."
            )

        # 2) Default model (you can change this later)
        self.model = model

        # 3) OpenRouter chat completions endpoint
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"

        # 4) Required headers
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            # These two help identify your app in OpenRouter’s dashboard
            "HTTP-Referer": "https://qwen-cloud-engine.local",
            "X-Title": "Qwen Cloud Engine",
        }

    def chat(self, messages: list[dict], temperature: float = 0.7, max_tokens: int = 512) -> str:
        """
        Send a chat conversation to OpenRouter and return the model's reply text.

        messages example:
        [
            {"role": "system", "content": "You are Qwen, a helpful AI."},
            {"role": "user", "content": "Hello Qwen!"}
        ]
        """
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        try:
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=payload,
                timeout=30,
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            # You can later log this instead of returning it
            return f"[OpenRouter error] {e}"

        data = response.json()

        # Basic safety check
        if "choices" not in data or not data["choices"]:
            return "[OpenRouter error] Invalid response format"

        # Return just the text content of the first choice
        return data["choices"][0]["message"]["content"]

