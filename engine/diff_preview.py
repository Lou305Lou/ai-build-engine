import os
import difflib


class DiffPreview:
    def compute_diff(self, files, root="."):
        lines = []

        for path in files:
            full = os.path.join(root, path)
            if os.path.exists(full):
                try:
                    with open(full, "r", encoding="utf-8") as f:
                        old = f.read().splitlines()
                except Exception:
                    old = []
                new = old
                diff = difflib.unified_diff(
                    old, new,
                    fromfile=f"a/{path}",
                    tofile=f"b/{path}",
                    lineterm=""
                )
                for d in diff:
                    lines.append(d)
            else:
                lines.append(f"NEW FILE: {path}")

        return {"all": lines}
