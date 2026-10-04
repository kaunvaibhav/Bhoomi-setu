"""
BhoomiSetu Land Acquisition Intelligence - Data Validation & Preprocessing Pipeline
Ensures rigorous schema integrity, range validation, and reproducible feature scaling/encoding.
"""

import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.config import (
        MODEL_PATHS,
        REQUIRED_COLUMNS,
        VALID_ACQUISITION_STAGES,
        VALID_LAND_TYPES,
        VALID_LAND_USES,
        VALUATION_FEATURE_NAMES,
    )
    from intelligence.utils.logger import get_logger
except (ImportError, ModuleNotFoundError):
    from config import (
        MODEL_PATHS,
        REQUIRED_COLUMNS,
        VALID_ACQUISITION_STAGES,
        VALID_LAND_TYPES,
        VALID_LAND_USES,
        VALUATION_FEATURE_NAMES,
    )
    from utils.logger import get_logger

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, RobustScaler

logger = get_logger("preprocessing")


class DataValidationError(ValueError):
    """Raised when land acquisition administrative records violate schema or statutory constraints."""
    pass


def validate_dataset(df: pd.DataFrame, is_training: bool = False) -> Tuple[bool, List[str]]:
    """
    Validates land acquisition data records against statutory constraints and schema rules.

    Checks performed:
    1. Presence of all required columns.
    2. Absence of duplicate parcel identifiers (during batch validation).
    3. Positive non-zero ranges for critical acreage and valuation attributes.
    4. Legitimate range bounds for fractions (e.g. document completeness, R&R progress).
    5. Categorical membership validation against official administrative vocabularies.
    6. Non-null constraints on mandatory operational fields.

    Args:
        df: Input DataFrame to validate.
        is_training: If True, executes strict integrity checks required for batch training.

    Returns:
        Tuple of (is_valid: bool, issues: List[str]).

    Raises:
        DataValidationError: If critical constraints are violated.
    """
    issues: List[str] = []

    # 1. Required Columns Check
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        err = f"Validation Error: Missing required columns: {missing_cols}"
        logger.error(err)
        raise DataValidationError(err)

    # 2. Duplicate Parcel ID Check
    if "parcel_id" in df.columns:
        duplicate_count = df["parcel_id"].duplicated().sum()
        if duplicate_count > 0:
            msg = f"Duplicate parcel IDs detected: {duplicate_count} duplicates found."
            issues.append(msg)
            if is_training:
                logger.error(msg)
                raise DataValidationError(msg)
            else:
                logger.warning(msg)

    # 3. Missing Value Integrity
    null_counts = df[REQUIRED_COLUMNS].isnull().sum()
    cols_with_nulls = null_counts[null_counts > 0]
    if not cols_with_nulls.empty:
        msg = f"Null values detected in required columns: {cols_with_nulls.to_dict()}"
        issues.append(msg)
        logger.warning(msg)

    # 4. Numeric Range & Non-Negative Checks
    numeric_checks = [
        ("land_area_acres", 0.001, 10000.0, "strictly positive acreage required"),
        ("circle_rate_per_acre", 1.0, 1e9, "positive circle rate required"),
        ("nearby_transaction_avg", 0.0, 1e9, "non-negative nearby transaction rate required"),
        ("nearby_transaction_median", 0.0, 1e9, "non-negative nearby median transaction rate required"),
        ("declared_compensation", 0.0, 1e11, "non-negative compensation required"),
        ("historical_avg_value", 0.0, 1e9, "non-negative historical value required"),
        ("distance_to_nearest_transaction_km", 0.0, 200.0, "distance must be between 0 and 200 km"),
        ("infrastructure_proximity_score", 0.0, 100.0, "infrastructure proximity must be between 0 and 100"),
        ("affected_family_count", 0, 100000, "affected family count cannot be negative"),
        ("objection_count", 0, 100000, "objection count cannot be negative"),
        ("pending_days", 0, 20000, "pending days cannot be negative"),
        ("document_completeness", 0.0, 1.0, "document completeness must be a fraction between 0.0 and 1.0"),
        ("r_and_r_progress", 0.0, 1.0, "R&R progress must be a fraction between 0.0 and 1.0"),
    ]

    for col, min_val, max_val, desc in numeric_checks:
        if col in df.columns:
            invalid_mask = (df[col] < min_val) | (df[col] > max_val)
            invalid_cnt = invalid_mask.sum()
            if invalid_cnt > 0:
                err = f"Invalid range in '{col}' ({invalid_cnt} records violated bounds [{min_val}, {max_val}]: {desc})"
                issues.append(err)
                logger.error(err)
                raise DataValidationError(err)

    # 5. Categorical Domain Checks
    if "land_type" in df.columns:
        invalid_types = set(df["land_type"].dropna().unique()) - VALID_LAND_TYPES
        if invalid_types:
            err = f"Invalid land_type values: {invalid_types}. Allowed: {VALID_LAND_TYPES}"
            issues.append(err)
            raise DataValidationError(err)

    if "land_use" in df.columns:
        invalid_uses = set(df["land_use"].dropna().unique()) - VALID_LAND_USES
        if invalid_uses:
            err = f"Invalid land_use values: {invalid_uses}. Allowed: {VALID_LAND_USES}"
            issues.append(err)
            raise DataValidationError(err)

    if "acquisition_stage" in df.columns:
        invalid_stages = set(df["acquisition_stage"].dropna().unique()) - VALID_ACQUISITION_STAGES
        if invalid_stages:
            err = f"Invalid acquisition_stage values: {invalid_stages}. Allowed: {VALID_ACQUISITION_STAGES}"
            issues.append(err)
            raise DataValidationError(err)

    is_valid = len(issues) == 0
    if is_valid:
        logger.debug("Data validation completed successfully with zero schema errors.")
    return is_valid, issues


def build_preprocessing_pipeline(
    numerical_features: Optional[List[str]] = None,
) -> ColumnTransformer:
    """
    Constructs a robust scikit-learn preprocessing ColumnTransformer.
    Uses RobustScaler to gracefully handle valuation outliers without skewing statistics.

    Args:
        numerical_features: List of numerical feature names to scale. Defaults to VALUATION_FEATURE_NAMES.

    Returns:
        Configured ColumnTransformer instance.
    """
    if numerical_features is None:
        numerical_features = VALUATION_FEATURE_NAMES

    num_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", RobustScaler()),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, numerical_features),
        ],
        remainder="drop",
    )

    return preprocessor


def save_pipeline(pipeline: ColumnTransformer, filepath: Optional[Path] = None) -> Path:
    """
    Serializes fitted preprocessing pipeline to disk using joblib.

    Args:
        pipeline: Fitted scikit-learn transformer.
        filepath: Destination path (defaults to config.MODEL_PATHS['preprocessor']).

    Returns:
        Path of saved file.
    """
    target = filepath or MODEL_PATHS["preprocessor"]
    target.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, target)
    logger.info(f"Fitted preprocessor serialized to {target}")
    return target


def load_pipeline(filepath: Optional[Path] = None) -> ColumnTransformer:
    """
    Loads serialized preprocessing pipeline from disk.

    Args:
        filepath: Source path (defaults to config.MODEL_PATHS['preprocessor']).

    Returns:
        Fitted ColumnTransformer instance.
    """
    target = filepath or MODEL_PATHS["preprocessor"]
    if not target.exists():
        raise FileNotFoundError(f"Preprocessor artifact not found at {target}. Run training first.")
    preprocessor: ColumnTransformer = joblib.load(target)
    logger.debug(f"Loaded preprocessor from {target}")
    return preprocessor
