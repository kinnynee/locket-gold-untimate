"""Framework-neutral exception handlers."""

from __future__ import annotations

import logging
import uuid
from typing import Any

from .exceptions import AppError
from .logging_context import get_correlation_id, set_correlation_id
from .responses import build_error_response


logger = logging.getLogger(__name__)


def handle_exception(
    error: Exception,
    *,
    correlation_id: str | None = None,
    expose_internal_message: bool = False,
) -> tuple[dict[str, Any], int]:
    """Convert an exception to a response payload and status code."""
    active_correlation_id = correlation_id or get_correlation_id() or str(uuid.uuid4())
    set_correlation_id(active_correlation_id)

    if isinstance(error, AppError):
        logger.warning(
            "Handled application error",
            extra={"error_code": error.code, "correlation_id": active_correlation_id},
        )
    else:
        logger.exception(
            "Unhandled exception",
            extra={"error_code": "internal_error", "correlation_id": active_correlation_id},
        )

    payload = build_error_response(
        error,
        correlation_id=active_correlation_id,
        expose_internal_message=expose_internal_message,
    )
    return payload, int(payload["error"]["status_code"])
