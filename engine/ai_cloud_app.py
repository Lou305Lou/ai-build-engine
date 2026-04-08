from engine.openrouter_client import OpenRouterClient

class AICloudApp:
    def __init__(self, model="qwen/qwen-2.5-7b-instruct"):
        self.client = OpenRouterClient()
        self.model = model

    def run(self, system_prompt, user_prompt):
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]
        return self.client.chat(messages, model=self.model)


if __name__ == "__main__":
    app = AICloudApp()
    result = app.run(
        "You are the AI Cloud Engine.",
        "Explain your purpose in one short paragraph."
    )
    print(result)
