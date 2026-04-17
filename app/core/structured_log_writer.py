from app.core.structured_log import structured_log

class StructuredLogWriter:
    def write(self, event: str, data: dict):
        log = structured_log(event, data)
        print(log)
        return log

structured_log_writer = StructuredLogWriter()
