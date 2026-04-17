def get_system_tree():
    return {
        "tree": {
            "ai_cloud": ["commands", "runtime", "boot"],
            "api": ["routes", "middleware"],
            "core": ["settings", "version", "manifest"],
            "diagnostics": ["core", "runtime", "api"],
            "metrics": ["core", "collector"],
            "monitoring": ["middleware"],
            "internal": ["tools"]
        }
    }
