from app.ai.client import ai_model_client
from app.ai.prompts import build_file_tree_prompt
from app.ai.builders.file_tree_builder import file_tree_builder


async def handle_generate_file_tree(payload: dict) -> dict:
    """
    AI command: generate_file_tree
    - Takes the project design text
    - Builds the file tree prompt
    - Calls the AI model client
    - Builds the file tree structure
    """
    design_text = payload.get("design")
    if not design_text:
        return {"error": "Missing 'design' in payload"}

    prompt = build_file_tree_prompt(design_text)
    ai_response = await ai_model_client.generate(prompt)

    tree = file_tree_builder.build_tree(design_text)

    return {
        "command": "generate_file_tree",
        "tree": tree,
        "raw_ai_response": ai_response,
    }
