class ValidationGuard:
    def ensure(self, condition: bool, message: str):
        if not condition:
            raise ValueError(message)

validation_guard = ValidationGuard()
