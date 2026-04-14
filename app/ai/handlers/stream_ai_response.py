from app.ai.client import ai_model_client

async def handle_stream_ai_response(payload: dict):
    """
    Stream AI output token-by-token.
    """
    prompt = payload.get("prompt", "Hello AI, stream your response.")

    async for chunk in ai_model_client.stream(prompt):
        yield chunk
