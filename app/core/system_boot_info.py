def get_boot_info():
    return {
        "boot_sequence": [
            "load_settings",
            "init_logging",
            "register_lifecycle",
            "start_api"
        ],
        "status": "booted"
    }
