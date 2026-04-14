from app.ai.assembly.live_assembler import live_assembler

async def handle_stream_assemble_project(payload: dict):
    """
    Streaming project assembly pipeline with structured events.
    """
    async for event in live_assembler.assemble_stream(payload):
        yield event
