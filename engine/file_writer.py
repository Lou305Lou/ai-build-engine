import os


class FileWriter:
    def write_file(self, path, content):
        directory = os.path.dirname(path)
        if directory:
            os.makedirs(directory, exist_ok=True)

        status = "written"
        if os.path.exists(path):
            status = "overwritten"

        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

        return {"status": status, "path": path}

    def write_project(self, project):
        written = []
        overwritten = []
        errors = []

        for f in project.get("files", []):
            path = f["path"]
            content = f["content"]
            try:
                result = self.write_file(path, content)
                if result["status"] == "written":
                    written.append(path)
                else:
                    overwritten.append(path)
            except Exception as e:
                errors.append({"path": path, "error": str(e)})

        return {
            "written": written,
            "overwritten": overwritten,
            "errors": errors
        }
