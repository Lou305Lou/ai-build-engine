class DiagnosticsCore:
    def run(self):
        return {
            "diagnostics": "ok",
            "components": [
                "runtime",
                "api",
                "commands",
                "integration",
                "project_generator"
            ]
        }

diagnostics_core = DiagnosticsCore()

