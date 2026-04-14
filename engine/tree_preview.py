def build_tree_structure(paths):
    tree = {}
    file_count = 0
    folder_set = set()

    for p in paths:
        parts = p.split("/")
        node = tree
        for i, part in enumerate(parts):
            if i == len(parts) - 1:
                node.setdefault("__files__", []).append(part)
                file_count += 1
            else:
                folder_set.add("/".join(parts[: i + 1]))
                node = node.setdefault(part, {})

    folder_count = len(folder_set)
    return tree, file_count, folder_count


def render_tree(tree, prefix=""):
    lines = []
    files = tree.get("__files__", [])
    dirs = sorted([k for k in tree.keys() if k != "__files__"])

    for d in dirs:
        lines.append(f"{prefix}{d}/")
        lines.extend(render_tree(tree[d], prefix + "  "))

    for f in files:
        lines.append(f"{prefix}{f}")

    return lines
