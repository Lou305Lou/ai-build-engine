import os
from app.ai.history.history_manager import history_manager

class FileWriter:
    """
    Writes a file tree structure to disk safely.
    """

    def write_tree(self, tree: dict, base_path: str = ".") -> dict:
        """
        Write a nested file tree structure to disk.
        Creates a snapshot BEFORE writing.
        """
        root = tree.get("root", "generated_project")
        structure = tree.get("structure", {})

        root_path = os.path.join(base_path, root)

        # Create snapshot BEFORE writing
        snapshot = None
        if os.path.exists(root_path):
            snapshot = history_manager.create_snapshot(root_path)

        os.makedirs(root_path, exist_ok=True)

        write_log = []

        def write_node(node, current_path):
            for name, value in node.items():
                path = os.path.join(current_path, name)

                if isinstance(value, dict):
                    os.makedirs(path, exist_ok=True)
                    write_log.append({"type": "folder", "path": path})
                    write_node(value, path)
                else:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(value or "")
                    write_log.append({"type": "file", "path": path})

        write_node(structure, root_path)

        return {
            "root_path": root_path,
            "written": write_log,
            "snapshot": snapshot
        }


file_writer = FileWriter()

