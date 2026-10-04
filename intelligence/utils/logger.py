"""
BhoomiSetu Land Acquisition Intelligence - Logger Utility
Standardized logging handler for training, inference, and pipeline execution.
"""

import logging
import sys
from typing import Optional


def get_logger(name: Optional[str] = "intelligence", level: int = logging.INFO) -> logging.Logger:
    """
    Returns a configured logger instance with standardized formatting.

    Args:
        name: Name of the logger or module.
        level: Logging verbosity level (default: logging.INFO).

    Returns:
        logging.Logger instance.
    """
    logger = logging.getLogger(name)

    if not logger.handlers:
        logger.setLevel(level)

        formatter = logging.Formatter(
            fmt="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        logger.propagate = False

    return logger
