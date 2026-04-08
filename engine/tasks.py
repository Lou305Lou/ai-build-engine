from engine.json_output import force_json_output


def task_generate_project(prompt, engine):
    """
    Generates a full project scaffold using the active engine.
    Returns JSON.
    """
    messages = [
        {"role": "system", "content": engine["system_prompt"]},
        {"role": "user", "content": prompt}
    ]
    return force_json_output(engine["client"], messages)


def task_explain(prompt, engine):
    """
    Simple explanation task using the active engine.
    Returns JSON.
    """
    messages = [
        {"role": "system", "content": engine["system_prompt"]},
        {"role": "user", "content": prompt}
    ]
    return force_json_output(engine["client"], messages)


def task_stream(prompt, engine):
    """
    Streaming task: yields chunks and also returns full text.
    """
    messages = [
        {"role": "system", "content": engine["system_prompt"]},
        {"role": "user", "content": prompt}
    ]

    full_text = ""

    for chunk in engine["client"].stream_chat(messages, model=engine["model"]):
        yield chunk
        full_text += chunk

    # At the end, you could persist full_text somewhere if needed.
