import os
import json
from datetime import datetime


class HistoryManager:
    def __init__(self, history_dir=".history"):
        self.history_dir = history_dir
        os.makedirs(self.history_dir, exist_ok=True)

    def capture_state(self, root="."):
        files = []
        for base, _, filenames in os.walk(root):
            if base.startswith(f"./{self.history_dir}") or self.history_dir in base:
                continue
            for name in filenames:
                path = os.path.join(base, name)
                rel = os.path.relpath(path, root)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                except Exception:
                    content = None
                files.append({"path": rel, "content": content})
        return {"files": files}

    def save_snapshot(self, prompt, project_json, before_state, after_state):
        ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S_%f")
        snap_dir = os.path.join(self.history_dir, ts)
        os.makedirs(snap_dir, exist_ok=True)

        meta = {
            "prompt": prompt,
            "project": project_json
        }

        with open(os.path.join(snap_dir, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)

        with open(os.path.join(snap_dir, "before.json"), "w", encoding="utf-8") as f:
            json.dump(before_state, f, indent=2)

        with open(os.path.join(snap_dir, "after.json"), "w", encoding="utf-8") as f:
            json.dump(after_state, f, indent=2)

    def load_last_snapshot(self):
        if not os.path.exists(self.history_dir):
            return None
        entries = [
            d for d in os.listdir(self.history_dir)
            if os.path.isdir(os.path.join(self.history_dir, d))
        ]
        if not entries:
            return None
        last = sorted(entries)[-1]
        snap_dir = os.path.join(self.history_dir, last)

        try:
            with open(os.path.join(snap_dir, "before.json"), "r", encoding="utf-8") as f:
                before = json.load(f)
        except Exception:
            return None

        return {"dir": snap_dir, "before": before}

    def restore_snapshot(self, snapshot, root="."):
        before = snapshot["before"]
        current_files = set()

        for base, _, filenames in os.walk(root):
            if base.startswith(f"./{self.history_dir}") or self.history_dir in base:
                continue
            for name in filenames:
                path = os.path.join(base, name)
                rel = os.path.relpath(path, root)
                current_files.add(rel)

        before_files = {f["path"] for f in before["files"]}

        to_delete = current_files - before_files
        for rel in to_delete:
            path = os.path.join(root, rel)
            try:
                os.remove(path)
            except Exception:
                pass

        for f in before["files"]:
            path = os.path.join(root, f["path"])
            directory = os.path.dirname(path)
            if directory:
                os.makedirs(directory, exist_ok=True)
            if f["content"] is None:
                if os.path.exists(path):
                    try:
                        os.remove(path)
                    except Exception:
                        pass
            else:
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(f["content"])
