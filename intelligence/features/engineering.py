"""
BhoomiSetu Land Acquisition Intelligence - Feature Engineering Module
Transforms validated raw administrative records into derived indicators for anomaly detection and risk scoring.
"""

import sys
from pathlib import Path
from typing import Union

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.config import ENGINEERED_FEATURE_NAMES
    from intelligence.utils.logger import get_logger
except (ImportError, ModuleNotFoundError):
    from config import ENGINEERED_FEATURE_NAMES
    from utils.logger import get_logger

import numpy as np
import pandas as pd

logger = get_logger("feature_engineering")

# Stage to ordinal milestone mapping
STAGE_PROGRESS_MAP = {
    "Preliminary Notification (Sec 11)": 15.0,
    "SIA Survey (Sec 4)": 30.0,
    "Rehabilitation Scheme (Sec 16)": 45.0,
    "Declaration (Sec 19)": 60.0,
    "Enquiry & Award (Sec 23)": 75.0,
    "Compensation Disbursement": 90.0,
    "Possession Handover": 100.0,
}


class FeatureEngineer:
    """
    Deterministic feature engineering pipeline for land acquisition analytics.
    Avoids data leakage by utilizing solely per-record statutory ratios and domain benchmarks.
    """

    def __init__(self) -> None:
        self.engineered_feature_names = ENGINEERED_FEATURE_NAMES

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Derives all 10 domain-specific features from raw parcel attributes.

        Args:
            df: Validated DataFrame containing required raw land acquisition attributes.

        Returns:
            pd.DataFrame containing original columns plus engineered feature columns.
        """
        data = df.copy()

        # Prevent division by zero with safe small epsilon
        eps = 1e-6
        safe_land_area = np.maximum(data["land_area_acres"].values, eps)
        unit_compensation = data["declared_compensation"].values / safe_land_area

        # 1. compensation_to_circle_rate_ratio:
        # Measures declared unit award against notified circle rate.
        # RFCTLARR norms typically range between 2.0x and 4.0x (base * rural factor + 100% solatium).
        safe_circle_rate = np.maximum(data["circle_rate_per_acre"].values, eps)
        data["compensation_to_circle_rate_ratio"] = np.round(
            unit_compensation / safe_circle_rate, 4
        )

        # 2. compensation_to_market_ratio:
        # Compares declared unit rate against average registered transaction comparables.
        safe_market_avg = np.maximum(data["nearby_transaction_avg"].values, eps)
        data["compensation_to_market_ratio"] = np.round(
            unit_compensation / safe_market_avg, 4
        )

        # 3. compensation_deviation_percent:
        # Percent deviation from local median transaction value.
        safe_market_median = np.maximum(data["nearby_transaction_median"].values, eps)
        data["compensation_deviation_percent"] = np.round(
            ((unit_compensation - safe_market_median) / safe_market_median) * 100.0, 2
        )

        # 4. historical_value_deviation:
        # Percent deviation from 3-year historical average to capture sudden spikes or under-valuations.
        safe_hist_avg = np.maximum(data["historical_avg_value"].values, eps)
        data["historical_value_deviation"] = np.round(
            ((unit_compensation - safe_hist_avg) / safe_hist_avg) * 100.0, 2
        )

        # 5. pending_delay_score (0 - 100):
        # Normalized delay index relative to standard statutory ceiling (365 days / 1 year per major stage).
        # Delays exceeding 2-3 years face statutory lapse risk under Section 25.
        data["pending_delay_score"] = np.round(
            np.clip(data["pending_days"].values / 730.0, 0.0, 1.0) * 100.0, 2
        )

        # 6. document_completeness_score (0 - 100):
        # Rescales document completeness fraction to a standardized percentage.
        data["document_completeness_score"] = np.round(
            np.clip(data["document_completeness"].values, 0.0, 1.0) * 100.0, 2
        )

        # 7. objection_density:
        # Formal Section 15 objections filed per affected family. High values indicate severe community grievance.
        safe_affected_families = np.maximum(data["affected_family_count"].values, 1.0)
        data["objection_density"] = np.round(
            data["objection_count"].values / safe_affected_families, 3
        )

        # 8. r_and_r_completion_score (0 - 100):
        # Rescales Rehabilitation & Resettlement completion to percentage scale.
        data["r_and_r_completion_score"] = np.round(
            np.clip(data["r_and_r_progress"].values, 0.0, 1.0) * 100.0, 2
        )

        # 9. infrastructure_proximity_factor (0.0 - 1.0):
        # Proximity to designated expressways/freight corridors which legitimately justifies valuation premiums.
        data["infrastructure_proximity_factor"] = np.round(
            np.clip(data["infrastructure_proximity_score"].values / 100.0, 0.0, 1.0), 3
        )

        # 10. project_progress_indicator (0 - 100):
        # Ordinal benchmark of statutory milestone progression.
        data["project_progress_indicator"] = (
            data["acquisition_stage"].map(STAGE_PROGRESS_MAP).fillna(10.0).astype(float)
        )

        return data


def engineer_features(data: Union[pd.DataFrame, dict]) -> pd.DataFrame:
    """
    Convenience functional wrapper to generate engineered features.

    Args:
        data: Input DataFrame or dictionary representing parcel case(s).

    Returns:
        pd.DataFrame enriched with all engineered features.
    """
    if isinstance(data, dict):
        df = pd.DataFrame([data])
    elif isinstance(data, pd.DataFrame):
        df = data.copy()
    else:
        raise TypeError("Input data must be a pandas DataFrame or dictionary.")

    engineer = FeatureEngineer()
    return engineer.transform(df)
