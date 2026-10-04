"""
BhoomiSetu Land Acquisition Intelligence - Global Configuration
Centralized configuration, paths, thresholds, and hyperparameters.
"""

from pathlib import Path
from typing import Dict, List, Tuple

# Base paths
BASE_DIR: Path = Path(__file__).resolve().parent
DATA_DIR: Path = BASE_DIR / "data"
ARTIFACT_DIR: Path = BASE_DIR / "artifacts"
DATASET_PATH: Path = DATA_DIR / "sample_land_acquisition.csv"

# Reproducibility
RANDOM_SEED: int = 42

# Artifact file paths
MODEL_PATHS: Dict[str, Path] = {
    "preprocessor": ARTIFACT_DIR / "preprocessor.joblib",
    "anomaly_detector": ARTIFACT_DIR / "anomaly_detector.joblib",
    "risk_model": ARTIFACT_DIR / "risk_model.joblib",
    "feature_metadata": ARTIFACT_DIR / "feature_metadata.json",
}

# Anomaly Detection Settings (0-100 scale: 0 = very normal, 100 = highly unusual)
ANOMALY_THRESHOLD: float = 65.0

# Acquisition Risk Classification Thresholds (0-100 scale)
RISK_THRESHOLDS: Dict[str, Tuple[float, float]] = {
    "LOW": (0.0, 24.99),
    "MEDIUM": (25.0, 49.99),
    "HIGH": (50.0, 74.99),
    "CRITICAL": (75.0, 100.0),
}

# Model Hyperparameters
MODEL_PARAMETERS = {
    "isolation_forest": {
        "n_estimators": 150,
        "contamination": 0.10,
        "random_state": RANDOM_SEED,
        "max_samples": "auto",
        "bootstrap": False,
    },
    "risk_scoring": {
        "anomaly_weight": 0.35,
        "pending_days_weight": 0.20,
        "objection_density_weight": 0.15,
        "doc_incompleteness_weight": 0.15,
        "randr_deficit_weight": 0.15,
    },
}

# Required Raw Dataset Schema
REQUIRED_COLUMNS: List[str] = [
    "parcel_id",
    "state",
    "district",
    "land_area_acres",
    "land_type",
    "land_use",
    "circle_rate_per_acre",
    "nearby_transaction_avg",
    "nearby_transaction_median",
    "declared_compensation",
    "historical_avg_value",
    "distance_to_nearest_transaction_km",
    "infrastructure_proximity_score",
    "market_growth_rate",
    "affected_family_count",
    "objection_count",
    "pending_days",
    "document_completeness",
    "r_and_r_progress",
    "acquisition_stage",
]

CATEGORICAL_COLUMNS: List[str] = [
    "state",
    "district",
    "land_type",
    "land_use",
    "acquisition_stage",
]

NUMERICAL_RAW_COLUMNS: List[str] = [
    "land_area_acres",
    "circle_rate_per_acre",
    "nearby_transaction_avg",
    "nearby_transaction_median",
    "declared_compensation",
    "historical_avg_value",
    "distance_to_nearest_transaction_km",
    "infrastructure_proximity_score",
    "market_growth_rate",
    "affected_family_count",
    "objection_count",
    "pending_days",
    "document_completeness",
    "r_and_r_progress",
]

# Engineered Features Required for Modeling
ENGINEERED_FEATURE_NAMES: List[str] = [
    "compensation_to_circle_rate_ratio",
    "compensation_to_market_ratio",
    "compensation_deviation_percent",
    "historical_value_deviation",
    "pending_delay_score",
    "document_completeness_score",
    "objection_density",
    "r_and_r_completion_score",
    "infrastructure_proximity_factor",
    "project_progress_indicator",
]

# Features specifically used by the valuation anomaly detection model
VALUATION_FEATURE_NAMES: List[str] = [
    "compensation_to_circle_rate_ratio",
    "compensation_to_market_ratio",
    "compensation_deviation_percent",
    "historical_value_deviation",
    "distance_to_nearest_transaction_km",
    "infrastructure_proximity_factor",
    "market_growth_rate",
]

# Allowed Categorical Domains for Validation
VALID_LAND_TYPES = {"Agricultural", "Non-Agricultural", "Commercial", "Industrial", "Barren"}
VALID_LAND_USES = {"Irrigated Crop", "Dry Crop", "Commercial Hub", "Residential Zone", "Infrastructure Corridor"}
VALID_ACQUISITION_STAGES = {
    "Preliminary Notification (Sec 11)",
    "SIA Survey (Sec 4)",
    "Rehabilitation Scheme (Sec 16)",
    "Declaration (Sec 19)",
    "Enquiry & Award (Sec 23)",
    "Compensation Disbursement",
    "Possession Handover",
}
