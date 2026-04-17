from app.ai_cloud.ai_cloud_errors import AICloudRuntimeError

class AICloudRuntimeGuard:
    def ensure_loaded(self, app):
        if not app.loaded:
            raise AICloudRuntimeError("AI Cloud App not loaded")

ai_cloud_runtime_guard = AICloudRuntimeGuard()
