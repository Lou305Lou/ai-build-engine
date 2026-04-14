from engine.json_output import force_json_output

<<<<<<< HEAD
=======

>>>>>>> da645af (Save local changes before rebase)
def task_generate_project(prompt, engine):
    messages = [
        {"role": "system", "content": engine["system_prompt"]},
        {"role": "user", "content": prompt}
    ]
    return force_json_output(engine["client"], messages)

<<<<<<< HEAD
=======

>>>>>>> da645af (Save local changes before rebase)
def task_explain(prompt, engine):
    messages = [
        {"role": "system", "content": engine["system_prompt"]},
        {"role": "user", "content": prompt}
    ]
    return force_json_output(engine["client"], messages)
<<<<<<< HEAD
=======


def task_generate_project_structure(prompt, engine):
    # Detect if user wants the minimal version
    prompt_lower = prompt.lower()

    wants_minimal = any(
        kw in prompt_lower
        for kw in ["simple", "minimal", "tiny", "one file", "basic", "option a", "a)"]
    )

    if wants_minimal:
        system = """
You MUST return ONLY valid JSON in this exact format:

{
  "status": "ok",
  "project": {
    "files": [
      {
        "path": "string",
        "content": "string"
      }
    ]
  }
}

Generate a MINIMAL FastAPI app (Option A):

Files:
- main.py

main.py content:
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

Rules:
- No markdown.
- No explanations.
- No commentary.
- No code fences.
- No text outside the JSON.
"""
        user = f"Generate a minimal FastAPI project for: {prompt}"
        return engine.chat(system, user)

    # Otherwise generate full enterprise structure (Option C)
    system = """
You MUST return ONLY valid JSON in this exact format:

{
  "status": "ok",
  "project": {
    "files": [
      {
        "path": "string",
        "content": "string"
      }
    ]
  }
}

Generate an ENTERPRISE FastAPI project (Option C) with this structure:

app/
  main.py
  api/
    __init__.py
    v1/
      __init__.py
      routes/
        __init__.py
        users.py
        items.py
  core/
    __init__.py
    config.py
    logging.py
    security.py
    events.py
  models/
    __init__.py
    user.py
    item.py
  schemas/
    __init__.py
    user.py
    item.py
  services/
    __init__.py
    user_service.py
    item_service.py
  db/
    __init__.py
    session.py
    base.py
  utils/
    __init__.py
    pagination.py
    hashing.py
requirements.txt
Dockerfile
docker-compose.yml

Rules:
- No markdown.
- No explanations.
- No commentary.
- No code fences.
- No text outside the JSON.
- Every file listed above MUST be included.
- Every file MUST have valid Python code or config content.
"""
    user = f"Generate an enterprise FastAPI project for: {prompt}"
    return engine.chat(system, user)
>>>>>>> da645af (Save local changes before rebase)
