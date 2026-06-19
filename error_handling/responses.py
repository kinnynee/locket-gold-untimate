"""Standard error response builders."""

from __future__ import annotations

from typing import Any

from .exceptions import AppError


def build_error_response(
    error: Exception,
    *,
    correlation_id: str | None = None,
    expose_internal_message: bool = False,
) -> dict[str, Any]:
    """Build a safe, consistent error response payload."""
    if isinstance(error, AppError):
        code = error.code
        message = error.message
        status_code = error.status_code
        retryable = error.retryable
        details = error.details
    else:
        code = "internal_error"
        message = str(error) if expose_internal_message else "Internal server error"
        status_code = 500
        retryable = False
        details = {}

    return {
        "error": {
            "code": code,
            "message": message,
            "status_code": status_code,
            "retryable": retryable,
            "details": details,
            "correlation_id": correlation_id,
        }
    }
