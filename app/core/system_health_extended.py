from app.ai_cloud.ai_cloud_app import ai_cloud_app

def get_extended_health():
    return {
        "engine_loaded": ai_cloud_app.loaded,
        "components": {
            "runtime": "ok",
            "api": "ok",
            "commands": "ok"
        }
    }
