"""Fallback helpers for critical paths."""

from __future__ import annotations

from collections.abc import Callable
from typing import TypeVar


T = TypeVar("T")


def with_fallback(
    primary: Callable[[], T],
    fallback: Callable[[Exception], T],
    *,
    recoverable: tuple[type[Exception], ...] = (Exception,),
) -> T:
    """Run a primary action and return fallback output on recoverable errors."""
    try:
        return primary()
    except recoverable as error:
        return fallback(error)
