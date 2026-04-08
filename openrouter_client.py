import os
import requests

class OpenRouterClient:
    def __init__(self, api_key=None):
        # Load API key from argument or environment variable
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")

        if not self.api_key:
            raise ValueError(
                "OPENROUTER_API_KEY is missing. Set it in your environment or pass api_key to OpenRouterClient()."
            )

        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def chat(self, messages, model="qwen/qwen-2.5-7b-instruct"):
        """
        Sends a chat completion request to OpenRouter using a FREE model.
        """
        payload = {
            "model": model,
            "messages": messages,
        }

        response = requests.post(self.base_url, headers=self.headers, json=payload)

        # Raise error if OpenRouter returns an error (like 402)
        response.raise_for_status()

        data = response.json()
        return data["choices"][0]["message"]["content"]

