from app.ai.micro_engines.micro_chain_runner import micro_chain_runner


async def handle_run_micro_chain(payload: dict) -> dict:
    """
    AI command: run_micro_chain
    - Executes a linear micro-chain (ordered micro-tasks)
    - Returns the chain output
    """
    chain = payload.get("chain")
    if not chain:
        return {"error": "Missing 'chain' in payload"}

    result = await micro_chain_runner.run(chain)

    return {
        "command": "run_micro_chain",
        "result": result,
    }
