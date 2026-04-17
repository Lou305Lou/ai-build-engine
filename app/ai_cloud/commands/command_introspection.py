from app.ai_cloud.commands.command_registry import command_registry

def introspect_commands():
    return {
        "total": len(command_registry),
        "commands": list(command_registry.keys())
    }
