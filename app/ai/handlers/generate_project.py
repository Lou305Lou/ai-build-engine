from app.ai.client import ai_model_client
from app.ai.prompts import build_project_generation_prompt


async def handle_generate_project(payload: dict) -> dict:
    """
    AI command: generate_project
    - Builds the structured prompt
    - Calls the AI model client
    - Returns the model's raw design output
    """
    prompt = build_project_generation_prompt(payload)
    response_text = await ai_model_client.generate(prompt)

    return {
        "command": "generate_project",
        "design": response_text,
    }
