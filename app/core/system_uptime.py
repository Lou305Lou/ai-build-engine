import time

START_TIME = time.time()

def get_uptime():
    return {
        "uptime_seconds": int(time.time() - START_TIME)
    }
