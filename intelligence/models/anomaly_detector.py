"""
BhoomiSetu Land Acquisition Intelligence - Valuation Anomaly Detection
Uses IsolationForest to identify unusual valuation and compensation patterns.

DECISION-SUPPORT NOTICE:
This model identifies statistical deviations in compensation awards relative to circle rates,
historical benchmarks, and market transaction averages. It is strictly an administrative
decision-support tool and DOES NOT constitute evidence of fraud, corruption, or misconduct.
All flagged parcels require qualitative review by a designated revenue/acquisition officer.
"""

import sys
from pathlib import Path
from typing import Any, Dict, Optional, Union

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.config import ANOMALY_THRESHOLD, MODEL_PARAMETERS, MODEL_PATHS
    from intelligence.utils.logger import get_logger
except (ImportError, ModuleNotFoundError):
    from config import ANOMALY_THRESHOLD, MODEL_PARAMETERS, MODEL_PATHS
    from utils.logger import get_logger

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

logger = get_logger("anomaly_detector")


class AnomalyDetector:
    """
    IsolationForest-based valuation anomaly detector.
    Computes calibrated anomaly scores (0-100) where:
      0   = Highly consistent with statutory & market expectations (Normal)
      100 = Statistically anomalous compensation / valuation pattern
    """

    def __init__(
        self,
        contamination: float = MODEL_PARAMETERS["isolation_forest"]["contamination"],
        n_estimators: int = MODEL_PARAMETERS["isolation_forest"]["n_estimators"],
        random_state: int = MODEL_PARAMETERS["isolation_forest"]["random_state"],
        threshold: float = ANOMALY_THRESHOLD,
    ) -> None:
        self.contamination = contamination
        self.n_estimators = n_estimators
        self.random_state = random_state
        self.threshold = threshold

        self.model = IsolationForest(
            n_estimators=self.n_estimators,
            contamination=self.contamination,
            random_state=self.random_state,
            max_samples="auto",
            bootstrap=False,
            n_jobs=-1,
        )

        # Calibration parameters initialized after fit
        self.score_min_: float = -0.85
        self.score_max_: float = -0.35
        self.is_fitted_: bool = False

    def fit(self, X: np.ndarray) -> "AnomalyDetector":
        """
        Fits the IsolationForest model on valuation feature matrix.
        Calibrates the internal normalization bounds using empirical percentiles.

        Args:
            X: Preprocessed numerical feature array of shape (n_samples, n_features).

        Returns:
            self
        """
        logger.info(f"Training IsolationForest on {X.shape[0]} samples with {X.shape[1]} features...")
        self.model.fit(X)

        # Compute empirical scores on training distribution for stable calibration
        train_raw_scores = self.model.score_samples(X)
        # 1st percentile represents severe outliers; 95th percentile represents typical inliers
        self.score_min_ = float(np.percentile(train_raw_scores, 1.0))
        self.score_max_ = float(np.percentile(train_raw_scores, 95.0))

        if self.score_max_ <= self.score_min_:
            self.score_max_ = self.score_min_ + 0.1

        self.is_fitted_ = True
        logger.info(
            f"IsolationForest fitted successfully. Score calibration bounds: "
            f"[{self.score_min_:.4f}, {self.score_max_:.4f}]"
        )
        return self

    def score_samples_normalized(self, X: np.ndarray) -> np.ndarray:
        """
        Computes calibrated anomaly scores mapped to a standardized 0-100 scale.

        Scoring semantics:
        - In IsolationForest, score_samples() returns negative values where lower is more anomalous.
        - We invert and normalize so that:
            Higher score (towards 100) -> highly unusual valuation pattern
            Lower score (towards 0)    -> normal, typical statutory valuation pattern

        Args:
            X: Preprocessed feature array.

        Returns:
            1D np.ndarray of scores bounded in [0.0, 100.0].
        """
        if not self.is_fitted_:
            raise RuntimeError("AnomalyDetector must be fitted before scoring samples.")

        raw_scores = self.model.score_samples(X)
        # Invert: raw score near score_min_ maps to ~100; near score_max_ maps to ~0
        normalized = (self.score_max_ - raw_scores) / (self.score_max_ - self.score_min_) * 100.0
        return np.round(np.clip(normalized, 0.0, 100.0), 2)

    def predict(self, X: np.ndarray) -> Dict[str, Any]:
        """
        Performs inference for single or multiple feature vectors.

        Args:
            X: Preprocessed feature array.

        Returns:
            Dictionary containing:
                - 'raw_scores': list of raw IsolationForest scores
                - 'normalized_scores': list of scores on 0-100 scale
                - 'anomaly_flags': list of booleans indicating if score >= threshold
                - 'interpretations': list of descriptive administrative labels
        """
        if not self.is_fitted_:
            raise RuntimeError("AnomalyDetector must be fitted before making predictions.")

        if X.ndim == 1:
            X = X.reshape(1, -1)

        raw_scores = self.model.score_samples(X)
        norm_scores = self.score_samples_normalized(X)
        flags = [bool(s >= self.threshold) for s in norm_scores]

        interpretations = []
        for s, f in zip(norm_scores, flags):
            if f:
                if s >= 80.0:
                    interpretations.append("Significant valuation pattern anomaly - manual review recommended")
                else:
                    interpretations.append("Moderate valuation deviation - administrative review advised")
            else:
                interpretations.append("Valuation pattern consistent with established local benchmarks")

        return {
            "raw_scores": raw_scores.tolist(),
            "normalized_scores": norm_scores.tolist(),
            "anomaly_flags": flags,
            "interpretations": interpretations,
        }

    def save(self, filepath: Optional[Path] = None) -> Path:
        """Serializes trained model artifact to disk."""
        target = filepath or MODEL_PATHS["anomaly_detector"]
        target.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self, target)
        logger.info(f"AnomalyDetector saved to {target}")
        return target

    @classmethod
    def load(cls, filepath: Optional[Path] = None) -> "AnomalyDetector":
        """Loads serialized model artifact from disk."""
        target = filepath or MODEL_PATHS["anomaly_detector"]
        if not target.exists():
            raise FileNotFoundError(f"Anomaly detector artifact not found at {target}. Run training first.")
        detector: AnomalyDetector = joblib.load(target)
        logger.debug(f"Loaded AnomalyDetector from {target}")
        return detector
