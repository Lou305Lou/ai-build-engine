import os
import json
import shutil
from datetime import datetime

class HistoryManager:
    """
    Stores snapshots of generated files so the system can undo and restore.
    """

    HISTORY_DIR = ".ai_history"

    def __init__(self):
        os.makedirs(self.HISTORY_DIR, exist_ok=True)

    def _timestamp(self):
        return datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    def create_snapshot(self, root_path: str):
        """
        Create a snapshot of the entire generated project folder.
        """
        if not os.path.exists(root_path):
            return None

        snapshot_name = f"snapshot_{self._timestamp()}"
        snapshot_path = os.path.join(self.HISTORY_DIR, snapshot_name)

        shutil.copytree(root_path, snapshot_path)

        metadata = {
            "snapshot": snapshot_name,
            "root_path": root_path,
            "timestamp": self._timestamp()
        }

        with open(os.path.join(snapshot_path, "metadata.json"), "w") as f:
            json.dump(metadata, f, indent=2)

        return metadata

    def list_snapshots(self):
        """
        List all snapshots.
        """
        return [
            name for name in os.listdir(self.HISTORY_DIR)
            if name.startswith("snapshot_")
        ]

    def restore_snapshot(self, snapshot_name: str):
        """
        Restore a snapshot by overwriting the target folder.
        """
        snapshot_path = os.path.join(self.HISTORY_DIR, snapshot_name)
        if not os.path.exists(snapshot_path):
            return {"error": "Snapshot not found"}

        with open(os.path.join(snapshot_path, "metadata.json")) as f:
            metadata = json.load(f)

        root_path = metadata["root_path"]

        if os.path.exists(root_path):
            shutil.rmtree(root_path)

        shutil.copytree(snapshot_path, root_path)

        return {"restored": root_path, "snapshot": snapshot_name}


# Global instance
history_manager = HistoryManager()
