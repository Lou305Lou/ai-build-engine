from app.core.version import APP_VERSION
from app.core.system_tags import get_system_tags

def generate_manifest():
    return {
        "version": APP_VERSION,
        "tags": get_system_tags(),
        "status": "operational"
    }
