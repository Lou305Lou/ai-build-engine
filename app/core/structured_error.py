def structured_error(message: str, request_id: str | None = None):
    return {
        "status": "error",
        "message": message,
        "request_id": request_id
    }
