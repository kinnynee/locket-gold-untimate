"""Correlation ID helpers for structured logging."""

from __future__ import annotations

import logging
import uuid
from contextvars import ContextVar


_correlation_id: ContextVar[str | None] = ContextVar("correlation_id", default=None)


def set_correlation_id(correlation_id: str | None = None) -> str:
    """Set the current request correlation ID."""
    active_id = correlation_id or str(uuid.uuid4())
    _correlation_id.set(active_id)
    return active_id


def get_correlation_id() -> str | None:
    """Return the current request correlation ID."""
    return _correlation_id.get()


class CorrelationIdFilter(logging.Filter):
    """Attach correlation_id to every log record."""

    def filter(self, record: logging.LogRecord) -> bool:
        record.correlation_id = get_correlation_id() or "-"
        return True


def configure_logging(level: int = logging.INFO) -> None:
    """Configure app logging with correlation ID support."""
    handler = logging.StreamHandler()
    handler.addFilter(CorrelationIdFilter())
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s %(levelname)s [%(correlation_id)s] %(name)s: %(message)s"
        )
    )

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(level)
