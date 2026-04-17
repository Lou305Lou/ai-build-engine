# Request Flow

1. Request enters API
2. Request ID assigned
3. Telemetry middleware logs request
4. Rate limit check
5. Monitoring + metrics update
6. Command routed
7. Response returned with X-Request-ID
8. Errors wrapped in structured envelope
