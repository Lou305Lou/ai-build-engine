from app.core.system_overview_provider import get_system_overview

def get_system_summary():
    overview = get_system_overview()
    return {
        "version": overview["profile"]["version"],
        "status": overview["health"]["components"],
        "tags": overview["profile"]["tags"]
    }
