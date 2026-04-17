class AICloudError(Exception):
    pass

class AICloudRuntimeError(AICloudError):
    pass

class AICloudValidationError(AICloudError):
    pass

class AICloudEngineError(AICloudError):
    pass
