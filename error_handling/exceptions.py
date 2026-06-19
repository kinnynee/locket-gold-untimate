"""Application exception types."""

from __future__ import annotations

from typing import Any


class AppError(Exception):
    """Base class for expected application errors."""

    code = "app_error"
    status_code = 500
    retryable = False

    def __init__(
        self,
        message: str | None = None,
        *,
        code: str | None = None,
        status_code: int | None = None,
        retryable: bool | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message or "Application error"
        self.code = code or self.code
        self.status_code = status_code or self.status_code
        self.retryable = self.retryable if retryable is None else retryable
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(AppError):
    code = "validation_error"
    status_code = 400


class ProcessingError(AppError):
    code = "processing_error"
    status_code = 422


class ExternalServiceError(AppError):
    code = "external_service_error"
    status_code = 502
    retryable = True
