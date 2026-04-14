from app.ai.client import ai_model_client
from app.ai.prompts import build_project_generation_prompt

async def handle_generate_project(payload: dict) -> dict:
    """
    First AI command handler: generate_project.

    For now:
      - Builds a structured prompt
      - Calls the AI model client
      - Returns the model's raw description as 'design'
    Later:
      - This will evolve to return concrete file trees and code.
    """
    prompt = build_project_generation_prompt(payload)
    response_text = await ai_model_client.generate(prompt)

    return {
        "command": "generate_project",
        "design": response_text,
    }
