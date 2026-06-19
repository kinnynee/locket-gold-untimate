"""Retry helpers for transient failures."""

from __future__ import annotations

import random
import time
from collections.abc import Callable
from functools import wraps
from typing import TypeVar


T = TypeVar("T")


def retry(
    *,
    max_attempts: int = 3,
    delay_seconds: float = 0.2,
    backoff: float = 2.0,
    jitter_seconds: float = 0.05,
    retry_on: tuple[type[Exception], ...] = (Exception,),
    should_retry: Callable[[Exception], bool] | None = None,
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """Retry a function when it raises a transient exception."""
    if max_attempts < 1:
        raise ValueError("max_attempts must be at least 1")

    def decorator(function: Callable[..., T]) -> Callable[..., T]:
        @wraps(function)
        def wrapper(*args, **kwargs) -> T:
            attempt = 1
            current_delay = delay_seconds

            while True:
                try:
                    return function(*args, **kwargs)
                except retry_on as error:
                    if should_retry is not None and not should_retry(error):
                        raise

                    if attempt >= max_attempts:
                        raise

                    sleep_for = current_delay + random.uniform(0, jitter_seconds)
                    time.sleep(sleep_for)
                    current_delay *= backoff
                    attempt += 1

        return wrapper

    return decorator
