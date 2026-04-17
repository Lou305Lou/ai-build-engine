from app.ai.history.history_manager import history_manager


async def handle_undo_last_write(payload: dict) -> dict:
    """
    AI command: undo_last_write
    - Restores the most recent snapshot
    - Returns the restore result
    """
    snapshots = history_manager.list_snapshots()
    if not snapshots:
        return {"error": "No snapshots available"}

    latest = sorted(snapshots)[-1]
    result = history_manager.restore_snapshot(latest)

    return {
        "command": "undo_last_write",
        "restored": result,
    }
