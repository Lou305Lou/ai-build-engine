from app.core.version import APP_VERSION
from app.core.system_tags import get_system_tags
from app.core.system_capabilities import get_system_capabilities
from app.core.system_limits import get_system_limits

def get_system_profile():
    return {
        "version": APP_VERSION,
        "tags": get_system_tags(),
        "capabilities": get_system_capabilities(),
        "limits": get_system_limits()
    }
