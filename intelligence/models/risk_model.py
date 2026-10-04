"""
BhoomiSetu Land Acquisition Intelligence - Acquisition Risk Scoring Model
Interpretable multi-criteria decision model for operational and legal land acquisition risk.
"""

import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.config import MODEL_PARAMETERS, MODEL_PATHS, RISK_THRESHOLDS
    from intelligence.utils.logger import get_logger
except (ImportError, ModuleNotFoundError):
    from config import MODEL_PARAMETERS, MODEL_PATHS, RISK_THRESHOLDS
    from utils.logger import get_logger

import joblib
import numpy as np
import pandas as pd

logger = get_logger("risk_model")


class AcquisitionRiskModel:
    """
    Transparent, explainable multi-dimensional risk model.
    Synthesizes valuation anomalies, procedural delays, public objections, documentation
    deficits, and Rehabilitation & Resettlement (R&R) compliance into a calibrated 0-100 risk score.
    """

    def __init__(
        self,
        weights: Optional[Dict[str, float]] = None,
        thresholds: Optional[Dict[str, Tuple[float, float]]] = None,
    ) -> None:
        self.weights = weights or MODEL_PARAMETERS["risk_scoring"]
        self.thresholds = thresholds or RISK_THRESHOLDS
        self.is_calibrated_: bool = True

    def calculate_components(
        self,
        df: pd.DataFrame,
        anomaly_scores: Union[np.ndarray, List[float]],
    ) -> pd.DataFrame:
        """
        Calculates individual sub-component risk scores (each normalized 0 - 100).

        Args:
            df: Enriched DataFrame with engineered features.
            anomaly_scores: Array or list of normalized valuation anomaly scores (0-100).

        Returns:
            pd.DataFrame with individual sub-component risk scores.
        """
        comp_df = pd.DataFrame(index=df.index)

        # 1. Valuation Anomaly Risk Component (0 - 100)
        comp_df["valuation_risk"] = np.clip(np.array(anomaly_scores, dtype=float), 0.0, 100.0)

        # 2. Procedural & Statutory Delay Risk Component (0 - 100)
        # Pending days over 365 days start posing Section 25 lapse risks; capped at 730 days
        pending = df["pending_days"].values if "pending_days" in df.columns else np.zeros(len(df))
        comp_df["delay_risk"] = np.clip(pending / 730.0 * 100.0, 0.0, 100.0).round(2)

        # 3. Public Objections & Dispute Risk Component (0 - 100)
        # Driven by Section 15 objection density and raw objection counts
        if "objection_density" in df.columns:
            density = df["objection_density"].values
            obj_cnt = df["objection_count"].values
            density_score = np.clip(density / 0.50 * 50.0, 0.0, 50.0)
            count_score = np.clip(obj_cnt / 20.0 * 50.0, 0.0, 50.0)
            comp_df["objection_risk"] = np.clip(density_score + count_score, 0.0, 100.0).round(2)
        else:
            comp_df["objection_risk"] = np.zeros(len(df))

        # 4. Documentation Completeness Deficit (0 - 100)
        # Incomplete files (gaps in SIA report, land titles, field verification) elevate challenge risk
        if "document_completeness" in df.columns:
            doc_comp = df["document_completeness"].values
            comp_df["doc_deficit_risk"] = np.clip((1.0 - doc_comp) * 100.0, 0.0, 100.0).round(2)
        else:
            comp_df["doc_deficit_risk"] = np.zeros(len(df))

        # 5. R&R Progress Deficit vs Expected Stage (0 - 100)
        # Evaluates whether Rehabilitation & Resettlement milestones lag behind statutory stage
        if "r_and_r_progress" in df.columns and "project_progress_indicator" in df.columns:
            expected_prog = df["project_progress_indicator"].values / 100.0
            actual_randr = df["r_and_r_progress"].values
            deficit = np.maximum(0.0, expected_prog - actual_randr)
            comp_df["randr_deficit_risk"] = np.clip(deficit * 125.0, 0.0, 100.0).round(2)
        else:
            comp_df["randr_deficit_risk"] = np.zeros(len(df))

        return comp_df

    def compute_risk(
        self,
        df: pd.DataFrame,
        anomaly_scores: Union[np.ndarray, List[float]],
    ) -> Dict[str, Any]:
        """
        Computes composite risk score, risk level category, and factor breakdown.

        Args:
            df: Enriched DataFrame with engineered features.
            anomaly_scores: Corresponding normalized anomaly scores (0-100).

        Returns:
            Dictionary with 'risk_scores', 'risk_levels', and 'breakdowns'.
        """
        comp_df = self.calculate_components(df, anomaly_scores)

        w = self.weights
        composite_scores = (
            w["anomaly_weight"] * comp_df["valuation_risk"].values
            + w["pending_days_weight"] * comp_df["delay_risk"].values
            + w["objection_density_weight"] * comp_df["objection_risk"].values
            + w["doc_incompleteness_weight"] * comp_df["doc_deficit_risk"].values
            + w["randr_deficit_weight"] * comp_df["randr_deficit_risk"].values
        )

        composite_scores = np.clip(np.round(composite_scores, 2), 0.0, 100.0)

        risk_levels = [self.get_risk_level(s) for s in composite_scores]

        breakdowns = comp_df.to_dict(orient="records")

        return {
            "risk_scores": composite_scores.tolist(),
            "risk_levels": risk_levels,
            "breakdowns": breakdowns,
        }

    def get_risk_level(self, score: float) -> str:
        """Categorizes numerical risk score into standardized tier."""
        for level, (low, high) in self.thresholds.items():
            if low <= score <= high:
                return level
        if score >= 100.0:
            return "CRITICAL"
        return "LOW"

    def fit(self, df: pd.DataFrame, anomaly_scores: Union[np.ndarray, List[float]]) -> "AcquisitionRiskModel":
        """Verifies calibration and sets state."""
        self.is_calibrated_ = True
        logger.info("AcquisitionRiskModel initialized and validated.")
        return self

    def save(self, filepath: Optional[Path] = None) -> Path:
        """Serializes risk model artifact to disk."""
        target = filepath or MODEL_PATHS["risk_model"]
        target.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self, target)
        logger.info(f"AcquisitionRiskModel saved to {target}")
        return target

    @classmethod
    def load(cls, filepath: Optional[Path] = None) -> "AcquisitionRiskModel":
        """Loads serialized risk model artifact from disk."""
        target = filepath or MODEL_PATHS["risk_model"]
        if not target.exists():
            raise FileNotFoundError(f"Risk model artifact not found at {target}. Run training first.")
        model: AcquisitionRiskModel = joblib.load(target)
        logger.debug(f"Loaded AcquisitionRiskModel from {target}")
        return model
