from app.ai_cloud.commands.command_registry import command_registry

def command_diagnostics():
    return {
        "registered_commands": list(command_registry.keys())
    }

