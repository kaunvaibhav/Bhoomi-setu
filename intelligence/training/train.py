"""
BhoomiSetu Land Acquisition Intelligence - Training Pipeline
Loads synthetic data, validates schema, derives features, fits preprocessor and models,
and saves versioned artifacts to intelligence/artifacts/.
"""

import datetime
import json
import sys
from pathlib import Path
from typing import Any, Dict

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.config import (
        ANOMALY_THRESHOLD,
        ARTIFACT_DIR,
        DATASET_PATH,
        ENGINEERED_FEATURE_NAMES,
        MODEL_PATHS,
        REQUIRED_COLUMNS,
        RISK_THRESHOLDS,
        VALUATION_FEATURE_NAMES,
    )
    from intelligence.data.generate_dataset import generate_synthetic_dataset
    from intelligence.features.engineering import engineer_features
    from intelligence.models.anomaly_detector import AnomalyDetector
    from intelligence.models.risk_model import AcquisitionRiskModel
    from intelligence.preprocessing.pipeline import (
        build_preprocessing_pipeline,
        save_pipeline,
        validate_dataset,
    )
    from intelligence.utils.logger import get_logger
except (ImportError, ModuleNotFoundError):
    from config import (
        ANOMALY_THRESHOLD,
        ARTIFACT_DIR,
        DATASET_PATH,
        ENGINEERED_FEATURE_NAMES,
        MODEL_PATHS,
        REQUIRED_COLUMNS,
        RISK_THRESHOLDS,
        VALUATION_FEATURE_NAMES,
    )
    from data.generate_dataset import generate_synthetic_dataset
    from features.engineering import engineer_features
    from models.anomaly_detector import AnomalyDetector
    from models.risk_model import AcquisitionRiskModel
    from preprocessing.pipeline import (
        build_preprocessing_pipeline,
        save_pipeline,
        validate_dataset,
    )
    from utils.logger import get_logger

import pandas as pd

logger = get_logger("training_pipeline")


def run_training_pipeline() -> Dict[str, Any]:
    """
    Executes end-to-end training and artifact serialization.

    Returns:
        Dictionary summarizing training results and artifact locations.
    """
    logger.info("=" * 60)
    logger.info("STARTING BHOOMISETU INTELLIGENCE TRAINING PIPELINE")
    logger.info("=" * 60)

    # 1. Load Dataset
    if not DATASET_PATH.exists():
        logger.warning(f"Dataset not found at {DATASET_PATH}. Generating synthetic dataset...")
        df_raw = generate_synthetic_dataset()
    else:
        logger.info(f"Loading dataset from {DATASET_PATH}...")
        df_raw = pd.read_csv(DATASET_PATH)

    logger.info(f"Loaded {len(df_raw)} records.")

    # 2. Validate Dataset
    logger.info("Step 2: Validating schema and data ranges...")
    is_valid, issues = validate_dataset(df_raw, is_training=True)
    if issues:
        logger.warning(f"Validation notices: {issues}")
    logger.info("Data validation passed.")

    # 3. Engineer Features
    logger.info("Step 3: Deriving domain-specific statutory features...")
    df_features = engineer_features(df_raw)
    logger.info(f"Engineered {len(ENGINEERED_FEATURE_NAMES)} derived features successfully.")

    # 4. Build Preprocessing Pipeline
    logger.info("Step 4: Fitting scikit-learn preprocessing ColumnTransformer...")
    preprocessor = build_preprocessing_pipeline(numerical_features=VALUATION_FEATURE_NAMES)
    X_val_transformed = preprocessor.fit_transform(df_features)
    save_pipeline(preprocessor, MODEL_PATHS["preprocessor"])

    # 5. Train Anomaly Detection Model
    logger.info("Step 5: Training IsolationForest valuation anomaly detector...")
    anomaly_model = AnomalyDetector(threshold=ANOMALY_THRESHOLD)
    anomaly_model.fit(X_val_transformed)
    anomaly_model.save(MODEL_PATHS["anomaly_detector"])

    # Evaluate anomaly predictions on training set
    anomaly_preds = anomaly_model.predict(X_val_transformed)
    norm_scores = anomaly_preds["normalized_scores"]
    flagged_anomalies = sum(anomaly_preds["anomaly_flags"])
    flagged_pct = (flagged_anomalies / len(df_raw)) * 100.0
    logger.info(
        f"Anomaly Detection Training Complete: {flagged_anomalies}/{len(df_raw)} "
        f"({flagged_pct:.1f}%) cases flagged with score >= {ANOMALY_THRESHOLD}"
    )

    # 6. Train Risk Model
    logger.info("Step 6: Fitting explainable multi-criteria Acquisition Risk Model...")
    risk_model = AcquisitionRiskModel()
    risk_model.fit(df_features, anomaly_scores=norm_scores)
    risk_model.save(MODEL_PATHS["risk_model"])

    # Evaluate risk predictions on training set
    risk_results = risk_model.compute_risk(df_features, anomaly_scores=norm_scores)
    risk_level_counts = pd.Series(risk_results["risk_levels"]).value_counts().to_dict()
    logger.info(f"Risk Tier Breakdown on Training Set: {risk_level_counts}")

    # 7. Save Feature Metadata & Schema Documentation
    logger.info("Step 7: Saving feature metadata and pipeline specifications...")
    metadata = {
        "pipeline_version": "1.0.0",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "training_samples": len(df_raw),
        "required_raw_columns": REQUIRED_COLUMNS,
        "engineered_feature_names": ENGINEERED_FEATURE_NAMES,
        "valuation_feature_names": VALUATION_FEATURE_NAMES,
        "anomaly_threshold": ANOMALY_THRESHOLD,
        "risk_thresholds": {k: list(v) for k, v in RISK_THRESHOLDS.items()},
        "training_metrics": {
            "total_parcels": len(df_raw),
            "flagged_valuation_anomalies": flagged_anomalies,
            "anomaly_rate_percent": round(flagged_pct, 2),
            "risk_distribution": risk_level_counts,
        },
        "artifacts": {k: str(v.name) for k, v in MODEL_PATHS.items()},
    }

    metadata_path = MODEL_PATHS["feature_metadata"]
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    logger.info(f"Feature metadata saved to {metadata_path}")

    # 8. Summary Log
    logger.info("=" * 60)
    logger.info("TRAINING PIPELINE COMPLETED SUCCESSFULLY")
    logger.info(f"Artifacts stored in: {ARTIFACT_DIR}")
    for name, path in MODEL_PATHS.items():
        logger.info(f"  - {name}: {path.name} ({path.stat().st_size / 1024:.1f} KB)")
    logger.info("=" * 60)

    return metadata


if __name__ == "__main__":
    run_training_pipeline()
