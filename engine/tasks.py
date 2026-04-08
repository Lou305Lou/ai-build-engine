# engine/tasks.py

from engine.json_output import force_json_output

def task_generate_project(prompt, client):
    messages = [
        {"role": "system", "content": "You generate full project scaffolds."},
        {"role": "user", "content": prompt}
    ]
    return force_json_output(client, messages)


def task_explain(prompt, client):
    messages = [
        {"role": "system", "content": "You explain concepts clearly."},
        {"role": "user", "content": prompt}
    ]
    return force_json_output(client, messages)
