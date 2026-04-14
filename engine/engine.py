from engine.openrouter_client import OpenRouterClient
from engine.json_output import force_json_output


class Engine:
    def __init__(self, model, system_prompt):
        self.model = model
        self.system_prompt = system_prompt

        self.client = OpenRouterClient()
        self.client.set_model(model)

    def chat(self, system_prompt, user_prompt):
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        return force_json_output(self.client, messages)

    def __getitem__(self, key):
        if key == "client":
            return self.client
        if key == "system_prompt":
            return self.system_prompt
        if key == "model":
            return self.model
        raise KeyError(key)
