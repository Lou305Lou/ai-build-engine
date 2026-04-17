from app.ai_cloud.ai_cloud_app import ai_cloud_app

def runtime_diagnostics():
    return {
        "runtime_loaded": ai_cloud_app.loaded
    }
