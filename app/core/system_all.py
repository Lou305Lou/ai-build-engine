from app.core.system_profile import get_system_profile
from app.core.system_overview_provider import get_system_overview
from app.core.system_summary import get_system_summary
from app.core.system_runtime_info import get_runtime_info
from app.core.system_environment import get_system_environment
from app.core.system_uptime import get_uptime
from app.core.system_build_info import get_build_info
from app.core.system_release_notes import get_release_notes
from app.core.system_changelog import get_changelog
from app.core.system_api_schema import get_api_schema
from app.core.system_api_map import get_api_map
from app.core.system_endpoints import get_all_endpoints
from app.core.system_dependencies import get_dependencies
from app.core.system_modules import get_system_modules
from app.core.system_tree import get_system_tree

def get_system_all():
    return {
        "profile": get_system_profile(),
        "overview": get_system_overview(),
        "summary": get_system_summary(),
        "runtime": get_runtime_info(),
        "environment": get_system_environment(),
        "uptime": get_uptime(),
        "build": get_build_info(),
        "release_notes": get_release_notes(),
        "changelog": get_changelog(),
        "api_schema": get_api_schema(),
        "api_map": get_api_map(),
        "endpoints": get_all_endpoints(),
        "dependencies": get_dependencies(),
        "modules": get_system_modules(),
        "tree": get_system_tree(),
    }

