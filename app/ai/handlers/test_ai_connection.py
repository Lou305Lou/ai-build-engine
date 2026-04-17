from app.ai.client import ai_model_client


async def handle_test_ai_connection(payload: dict) -> dict:
    """
    AI command: test_ai_connection
    - Sends a simple prompt to verify AI connectivity
    - Returns both the prompt and the AI response
    """
    prompt = payload.get("prompt", "Hello AI, respond with a short message.")
    response = await ai_model_client.generate(prompt)

    return {
        "command": "test_ai_connection",
        "prompt": prompt,
        "response": response,
    }
