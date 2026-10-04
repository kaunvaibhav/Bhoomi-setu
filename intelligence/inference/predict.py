"""
BhoomiSetu Land Acquisition Intelligence - Inference Pipeline
Executes end-to-end evaluation for incoming land acquisition parcels:
Validation -> Feature Engineering -> Model Inference -> Explainability -> JSON Output.
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.config import MODEL_PATHS
    from intelligence.explainability.explanations import generate_case_explanation
    from intelligence.features.engineering import engineer_features
    from intelligence.models.anomaly_detector import AnomalyDetector
    from intelligence.models.risk_model import AcquisitionRiskModel
    from intelligence.preprocessing.pipeline import load_pipeline, validate_dataset
    from intelligence.utils.logger import get_logger
except (ImportError, ModuleNotFoundError):
    from config import MODEL_PATHS
    from explainability.explanations import generate_case_explanation
    from features.engineering import engineer_features
    from models.anomaly_detector import AnomalyDetector
    from models.risk_model import AcquisitionRiskModel
    from preprocessing.pipeline import load_pipeline, validate_dataset
    from utils.logger import get_logger

import pandas as pd

logger = get_logger("inference")

# Cached model instances for low-latency repeated scoring
_CACHED_PREPROCESSOR = None
_CACHED_ANOMALY_MODEL = None
_CACHED_RISK_MODEL = None


def get_inference_models():
    """Retrieves or loads cached pipeline artifacts."""
    global _CACHED_PREPROCESSOR, _CACHED_ANOMALY_MODEL, _CACHED_RISK_MODEL
    if _CACHED_PREPROCESSOR is None:
        _CACHED_PREPROCESSOR = load_pipeline(MODEL_PATHS["preprocessor"])
    if _CACHED_ANOMALY_MODEL is None:
        _CACHED_ANOMALY_MODEL = AnomalyDetector.load(MODEL_PATHS["anomaly_detector"])
    if _CACHED_RISK_MODEL is None:
        _CACHED_RISK_MODEL = AcquisitionRiskModel.load(MODEL_PATHS["risk_model"])
    return _CACHED_PREPROCESSOR, _CACHED_ANOMALY_MODEL, _CACHED_RISK_MODEL


def predict_case(case_data: Union[Dict[str, Any], pd.Series, pd.DataFrame]) -> Dict[str, Any]:
    """
    Evaluates a single land acquisition parcel and produces an explainable decision-support assessment.

    Steps:
    1. Validates input schema and numerical ranges.
    2. Enriches case with statutory engineered features.
    3. Transforms features through scikit-learn preprocessor.
    4. Computes normalized valuation anomaly score (0-100) and flag.
    5. Computes multi-criteria operational risk score (0-100) and risk tier.
    6. Derives non-technical explainability factors and officer recommendations.
    7. Returns clean, structured JSON-compatible response.

    Args:
        case_data: Dictionary, Series, or single-row DataFrame representing the parcel.

    Returns:
        Structured dictionary matching decision-support API contract.
    """
    if isinstance(case_data, dict):
        df_raw = pd.DataFrame([case_data])
    elif isinstance(case_data, pd.Series):
        df_raw = pd.DataFrame([case_data.to_dict()])
    elif isinstance(case_data, pd.DataFrame):
        df_raw = case_data.copy().head(1)
    else:
        raise TypeError("Input case_data must be a dict, pd.Series, or pd.DataFrame.")

    # 1. Validation
    validate_dataset(df_raw, is_training=False)

    parcel_id = str(df_raw["parcel_id"].iloc[0])

    # 2. Preprocessing & Models
    preprocessor, anomaly_model, risk_model = get_inference_models()

    # 3. Feature Engineering
    df_features = engineer_features(df_raw)

    # 4. Valuation Anomaly Prediction
    X_val = preprocessor.transform(df_features)
    anomaly_res = anomaly_model.predict(X_val)

    norm_score = float(anomaly_res["normalized_scores"][0])
    anomaly_flag = bool(anomaly_res["anomaly_flags"][0])

    # 5. Acquisition Risk Scoring
    risk_res = risk_model.compute_risk(df_features, anomaly_scores=[norm_score])
    risk_score = float(risk_res["risk_scores"][0])
    risk_level = str(risk_res["risk_levels"][0])
    breakdown = risk_res["breakdowns"][0]

    # 6. Human-Readable Explainability
    case_row = df_features.iloc[0]
    explanation = generate_case_explanation(
        case_row=case_row,
        anomaly_score=norm_score,
        anomaly_flag=anomaly_flag,
        risk_score=risk_score,
        risk_level=risk_level,
        component_breakdown=breakdown,
    )

    # 7. Structured Decision-Support Output Contract
    output = {
        "parcel_id": parcel_id,
        "anomaly": {
            "score": round(norm_score, 1),
            "flag": anomaly_flag,
        },
        "risk": {
            "score": round(risk_score, 1),
            "level": risk_level,
        },
        "top_factors": explanation["top_factors"],
        "recommendation": explanation["recommendation"],
    }

    return output


def predict_batch(cases: Union[List[Dict[str, Any]], pd.DataFrame]) -> List[Dict[str, Any]]:
    """Evaluates a batch of parcels."""
    if isinstance(cases, list):
        df_batch = pd.DataFrame(cases)
    elif isinstance(cases, pd.DataFrame):
        df_batch = cases.copy()
    else:
        raise TypeError("Input must be a list of dicts or a pd.DataFrame.")

    results = []
    for _, row in df_batch.iterrows():
        results.append(predict_case(row.to_dict()))
    return results


def run_sample_inference():
    """Demonstrates inference on both normal and high-variance parcel cases."""
    print("\n" + "=" * 60)
    print("BHOOMISETU LAND ACQUISITION INTELLIGENCE — SAMPLE INFERENCE RUN")
    print("=" * 60 + "\n")

    sample_normal = {
        "parcel_id": "BS-PARCEL-DEMO-01",
        "state": "Uttar Pradesh",
        "district": "Varanasi",
        "land_area_acres": 2.5,
        "land_type": "Agricultural",
        "land_use": "Irrigated Crop",
        "circle_rate_per_acre": 1250000.0,
        "nearby_transaction_avg": 1450000.0,
        "nearby_transaction_median": 1420000.0,
        "declared_compensation": 6800000.0,  # ~2.2x base rate (normal statutory multiplier + solatium)
        "historical_avg_value": 1300000.0,
        "distance_to_nearest_transaction_km": 1.2,
        "infrastructure_proximity_score": 60.0,
        "market_growth_rate": 0.08,
        "affected_family_count": 4,
        "objection_count": 1,
        "pending_days": 120,
        "document_completeness": 0.95,
        "r_and_r_progress": 0.85,
        "acquisition_stage": "Declaration (Sec 19)",
    }

    sample_flagged = {
        "parcel_id": "BS-PARCEL-DEMO-02",
        "state": "Maharashtra",
        "district": "Nagpur",
        "land_area_acres": 3.8,
        "land_type": "Agricultural",
        "land_use": "Dry Crop",
        "circle_rate_per_acre": 1100000.0,
        "nearby_transaction_avg": 1350000.0,
        "nearby_transaction_median": 1300000.0,
        "declared_compensation": 28500000.0,  # ~5.5x circle rate (unusually elevated)
        "historical_avg_value": 1150000.0,
        "distance_to_nearest_transaction_km": 5.4,
        "infrastructure_proximity_score": 45.0,
        "market_growth_rate": 0.06,
        "affected_family_count": 12,
        "objection_count": 14,  # High objection count
        "pending_days": 680,   # Delayed > 1.8 years
        "document_completeness": 0.58,  # Documentation deficit
        "r_and_r_progress": 0.20,  # Stalled R&R
        "acquisition_stage": "Enquiry & Award (Sec 23)",
    }

    print("Evaluating Case 1: Standard Procedural Case...")
    res1 = predict_case(sample_normal)
    print(json.dumps(res1, indent=2))

    print("\n" + "-" * 50 + "\n")

    print("Evaluating Case 2: Flagged High-Variance Case...")
    res2 = predict_case(sample_flagged)
    print(json.dumps(res2, indent=2))

    print("\n" + "=" * 60)
    print("Inference completed successfully.")
    print("=" * 60)


if __name__ == "__main__":
    run_sample_inference()
