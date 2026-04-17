from app.core.validation_guard import validation_guard

def validate_command_payload(payload: dict):
    validation_guard.ensure(isinstance(payload, dict), "Payload must be a dictionary")
