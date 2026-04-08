# engine/json_output.py

import json

JSON_SYSTEM_PROMPT = """
You MUST respond ONLY in valid JSON.
Do NOT include explanations, comments, or extra text.
If you cannot produce the requested output, return:
{"status": "error", "message": "Unable to complete task"}
"""

def force_json_output(client, messages):
    """
    Wraps the client.chat() call and ensures valid JSON is returned.
    If the model returns invalid JSON, attempts to repair it.
    """
    # Inject JSON system prompt
    full_messages = [
        {"role": "system", "content": JSON_SYSTEM_PROMPT},
        *messages
    ]

    raw = client.chat(full_messages)

    try:
        return json.loads(raw)
    except Exception:
        # Attempt to repair JSON by extracting the first valid block
        try:
            start = raw.index("{")
            end = raw.rindex("}") + 1
            repaired = raw[start:end]
            return json.loads(repaired)
        except Exception:
            return {
                "status": "error",
                "message": "Model returned invalid JSON",
                "raw": raw
            }
