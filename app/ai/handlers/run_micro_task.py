from app.ai.micro_engines.micro_task_runner import micro_task_runner


async def handle_run_micro_task(payload: dict) -> dict:
    """
    AI command: run_micro_task
    - Executes a single micro-task definition
    - Returns the micro-task result
    """
    task = payload.get("task")
    if not task:
        return {"error": "Missing 'task' in payload"}

    result = await micro_task_runner.run(task)

    return {
        "command": "run_micro_task",
        "result": result,
    }
