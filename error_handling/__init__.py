"""Shared error-handling utilities."""

from .exceptions import (
    AppError,
    ExternalServiceError,
    ProcessingError,
    ValidationError,
)
from .handlers import handle_exception
from .responses import build_error_response

__all__ = [
    "AppError",
    "ExternalServiceError",
    "ProcessingError",
    "ValidationError",
    "build_error_response",
    "handle_exception",
]
