import os
import requests


class OpenRouterClient:
    """
    Thin client for OpenRouter API with normal and streaming chat.
    """

    def __init__(self, api_key=None, base_url="https://openrouter.ai/api/v1"):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY is not set.")
        self.base_url = base_url

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def chat(self, messages, model="qwen/qwen-2.5-7b-instruct"):
        """
        Standard non-streaming chat. Returns full text.
        """
        url = f"{self.base_url}/chat/completions"
        payload = {
            "model": model,
            "messages": messages,
        }
        resp = requests.post(url, json=payload, headers=self._headers())
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]

    def stream_chat(self, messages, model="qwen/qwen-2.5-7b-instruct"):
        """
        Streaming chat. Yields text chunks as they arrive and
        returns the full text at the end.
        """
        url = f"{self.base_url}/chat/completions"
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
        }
        resp = requests.post(url, json=payload, headers=self._headers(), stream=True)
        resp.raise_for_status()

        full_text = ""

        for line in resp.iter_lines(decode_unicode=True):
            if not line:
                continue
            if not line.startswith("data:"):
                continue

            chunk = line[len("data:"):].strip()
            if chunk == "[DONE]":
                break

            try:
                data = requests.utils.json.loads(chunk)
                delta = data["choices"][0]["delta"].get("content", "")
                if delta:
                    full_text += delta
                    yield delta
            except Exception:
                # Ignore malformed chunks
                continue

        # Final return value if someone wants the whole thing
        return full_text
