class RateLimiter:
    def allow(self, key: str):
        return True

rate_limiter = RateLimiter()
