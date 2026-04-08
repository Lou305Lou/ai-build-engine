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
