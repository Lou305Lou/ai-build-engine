<<<<<<< HEAD
import json

def force_json_output(client, messages):
    system_wrapper = {
        "role": "system",
        "content": (
            "You MUST return valid JSON. "
            "Wrap your entire response in a JSON object. "
            "Do not include explanations outside the JSON."
        )
    }

    final_messages = [system_wrapper] + messages
    raw = client.chat(final_messages)

    try:
        return json.loads(raw)
    except Exception:
        try:
            fixed = raw.strip().split("{", 1)[1]
            fixed = "{" + fixed
            fixed = fixed.rsplit("}", 1)[0] + "}"
            return json.loads(fixed)
        except Exception:
            return {
                "status": "error",
                "message": "Model returned invalid JSON.",
                "raw_output": raw
            }
=======
from engine.engine import Engine


class EngineRegistry:
    def __init__(self):
        self.engines = {}

    def register_engine(self, name, model, system_prompt):
        self.engines[name] = Engine(
            model=model,
            system_prompt=system_prompt
        )

    def get(self, name):
        if name not in self.engines:
            raise ValueError(f"Engine '{name}' not found.")
        return self.engines[name]
>>>>>>> da645af (Save local changes before rebase)
