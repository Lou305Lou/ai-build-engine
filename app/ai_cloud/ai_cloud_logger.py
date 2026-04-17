import datetime

class AICloudLogger:
    def log(self, message: str):
        timestamp = datetime.datetime.utcnow().isoformat()
        print(f"[AI-CLOUD] {timestamp} | {message}")

ai_cloud_logger = AICloudLogger()
