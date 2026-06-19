# Error Handling Layer

This folder centralizes error-handling techniques for the monolith.

## Techniques included

- Global exception handling through `handlers.py`.
- Standardized error responses through `responses.py`.
- Clear application exceptions through `exceptions.py`.
- Correlation ID logging through `logging_context.py`.
- Retry for transient failures through `retry.py`.
- Fallback behavior for critical paths through `fallback.py`.

## Recommended response shape

```json
{
  "error": {
    "code": "processing_error",
    "message": "Could not process image",
    "status_code": 422,
    "retryable": false,
    "details": {},
    "correlation_id": "request-id"
  }
}
```

Keep raw stack traces in logs only. Return short, safe messages to clients.
