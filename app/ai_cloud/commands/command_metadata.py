from app.ai_cloud.commands.command_registry import command_registry

def get_command_metadata():
    return {
        "count": len(command_registry),
        "commands": list(command_registry.keys())
    }
