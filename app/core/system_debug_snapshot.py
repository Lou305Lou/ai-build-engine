from app.core.system_flags import get_system_flags
from app.core.system_modes import get_system_modes
from app.core.system_environment import get_system_environment
from app.core.system_runtime_info import get_runtime_info

def get_debug_snapshot():
    return {
        "flags": get_system_flags(),
        "modes": get_system_modes(),
        "environment": get_system_environment(),
        "runtime": get_runtime_info(),
    }
