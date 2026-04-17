from app.core.system_profile import get_system_profile
from app.core.system_health_extended import get_extended_health

def get_system_overview():
    return {
        "profile": get_system_profile(),
        "health": get_extended_health()
    }
