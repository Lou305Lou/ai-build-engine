from engine.json_output import force_json_output

def task_generate_project(prompt, engine):
    messages = [
        {"role": "system", "content": engine["system_prompt"]},
        {"role": "user", "content": prompt}
    ]
    return force_json_output(engine["client"], messages)

def task_explain(prompt, engine):
    messages = [
        {"role": "system", "content": engine["system_prompt"]},
        {"role": "user", "content": prompt}
    ]
    return force_json_output(engine["client"], messages)
