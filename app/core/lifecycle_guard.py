class LifecycleGuard:
    def ensure(self, condition: bool, message: str):
        if not condition:
            raise RuntimeError(message)

lifecycle_guard = LifecycleGuard()
