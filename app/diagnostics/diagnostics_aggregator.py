from app.diagnostics.diagnostics_core import diagnostics_core
from app.diagnostics.diagnostics_runtime import runtime_diagnostics
from app.diagnostics.diagnostics_api import api_diagnostics
from app.diagnostics.diagnostics_commands import command_diagnostics

def aggregate_diagnostics():
    return {
        "core": diagnostics_core.run(),
        "runtime": runtime_diagnostics(),
        "api": api_diagnostics(),
        "commands": command_diagnostics()
    }
