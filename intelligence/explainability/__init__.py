"""
Explainability module initialization.
"""
import sys
from pathlib import Path

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.explainability.explanations import generate_case_explanation
except (ImportError, ModuleNotFoundError):
    from explainability.explanations import generate_case_explanation

__all__ = ["generate_case_explanation"]
