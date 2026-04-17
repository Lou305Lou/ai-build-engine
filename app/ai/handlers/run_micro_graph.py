from app.ai.micro_engines.micro_graph_runner import micro_graph_runner


async def handle_run_micro_graph(payload: dict) -> dict:
    """
    AI command: run_micro_graph
    - Executes a directed micro-graph (nodes + edges)
    - Returns the graph execution result
    """
    graph = payload.get("graph")
    if not graph:
        return {"error": "Missing 'graph' in payload"}

    result = await micro_graph_runner.run(graph)

    return {
        "command": "run_micro_graph",
        "result": result,
    }
