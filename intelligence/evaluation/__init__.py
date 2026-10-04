"""
Evaluation module initialization.
"""
import sys
from pathlib import Path

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.evaluation.metrics import evaluate_pipeline
except (ImportError, ModuleNotFoundError):
    from evaluation.metrics import evaluate_pipeline

__all__ = ["evaluate_pipeline"]
