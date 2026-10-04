"""
BhoomiSetu Land Acquisition Intelligence - Evaluation Module
Evaluates anomaly detection and risk scoring pipelines using unsupervised distribution statistics
and synthetic benchmarking metrics.

METHODOLOGICAL NOTICE:
Evaluations conducted against synthetic development benchmarks exist solely to verify algorithm
stability, threshold calibration, and pipeline mechanics. They MUST NOT be interpreted as
field-validated operational accuracy on real government land acquisition proceedings.
"""

import sys
from pathlib import Path
from typing import Any, Dict

_INTELLIGENCE_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _INTELLIGENCE_DIR.parent
for _p in [str(_REPO_ROOT), str(_INTELLIGENCE_DIR)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from intelligence.config import ANOMALY_THRESHOLD, DATASET_PATH, MODEL_PATHS
    from intelligence.features.engineering import engineer_features
    from intelligence.models.anomaly_detector import AnomalyDetector
    from intelligence.models.risk_model import AcquisitionRiskModel
    from intelligence.preprocessing.pipeline import load_pipeline
    from intelligence.utils.logger import get_logger
except (ImportError, ModuleNotFoundError):
    from config import ANOMALY_THRESHOLD, DATASET_PATH, MODEL_PATHS
    from features.engineering import engineer_features
    from models.anomaly_detector import AnomalyDetector
    from models.risk_model import AcquisitionRiskModel
    from preprocessing.pipeline import load_pipeline
    from utils.logger import get_logger

import numpy as np
import pandas as pd
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)

logger = get_logger("evaluation")


def evaluate_pipeline(dataset_path: Path = DATASET_PATH) -> Dict[str, Any]:
    """
    Executes comprehensive pipeline evaluation across distribution and benchmark metrics.

    Args:
        dataset_path: Path to CSV dataset containing test records.

    Returns:
        Dictionary containing metric summaries.
    """
    logger.info(f"Loading evaluation dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)

    # 1. Feature Engineering
    df_features = engineer_features(df)

    # 2. Load Pipeline Artifacts
    preprocessor = load_pipeline(MODEL_PATHS["preprocessor"])
    anomaly_model = AnomalyDetector.load(MODEL_PATHS["anomaly_detector"])
    risk_model = AcquisitionRiskModel.load(MODEL_PATHS["risk_model"])

    # 3. Model Predictions
    X_val = preprocessor.transform(df_features)
    anomaly_preds = anomaly_model.predict(X_val)
    norm_scores = np.array(anomaly_preds["normalized_scores"])
    pred_flags = np.array(anomaly_preds["anomaly_flags"], dtype=int)

    risk_results = risk_model.compute_risk(df_features, anomaly_scores=norm_scores)
    risk_scores = np.array(risk_results["risk_scores"])
    risk_levels = risk_results["risk_levels"]

    # 4. Statistical Distribution Analysis
    score_stats = {
        "min": float(np.min(norm_scores)),
        "median": float(np.median(norm_scores)),
        "mean": float(np.mean(norm_scores)),
        "p75": float(np.percentile(norm_scores, 75.0)),
        "p90": float(np.percentile(norm_scores, 90.0)),
        "p95": float(np.percentile(norm_scores, 95.0)),
        "max": float(np.max(norm_scores)),
        "flagged_ratio": float(np.mean(pred_flags)),
    }

    risk_stats = pd.Series(risk_levels).value_counts().to_dict()

    print("\n" + "=" * 65)
    print("BHOOMISETU INTELLIGENCE PIPELINE EVALUATION REPORT")
    print("=" * 65)
    print("\n[1] ANOMALY SCORE DISTRIBUTION (0-100 scale)")
    print(f"  - Total Parcels Evaluated: {len(df)}")
    print(f"  - Score Min / Median / Mean: {score_stats['min']:.1f} / {score_stats['median']:.1f} / {score_stats['mean']:.1f}")
    print(f"  - 75th / 90th / 95th Percentile: {score_stats['p75']:.1f} / {score_stats['p90']:.1f} / {score_stats['p95']:.1f}")
    print(f"  - Score Max: {score_stats['max']:.1f}")
    print(f"  - Flagged for Review (score >= {ANOMALY_THRESHOLD}): {np.sum(pred_flags)} ({score_stats['flagged_ratio'] * 100:.2f}%)")

    print("\n[2] RISK TIER DISTRIBUTION")
    for tier in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
        cnt = risk_stats.get(tier, 0)
        pct = (cnt / len(df)) * 100.0
        print(f"  - {tier:<10}: {cnt:>5} parcels ({pct:>5.1f}%)")

    # Cross tabulation
    cross_tab = pd.crosstab(
        pd.Series(risk_levels, name="Risk Tier"),
        pd.Series(["Flagged" if f else "Normal" for f in pred_flags], name="Anomaly Status"),
    )
    print("\n[3] RISK TIER VS ANOMALY CROSS-TABULATION")
    print(cross_tab.to_string())

    # 5. Benchmark Performance against Synthetic Labels (if available)
    synthetic_eval = {}
    if "_synthetic_is_anomaly" in df.columns:
        y_true = df["_synthetic_is_anomaly"].values

        p = precision_score(y_true, pred_flags, zero_division=0)
        r = recall_score(y_true, pred_flags, zero_division=0)
        f1 = f1_score(y_true, pred_flags, zero_division=0)
        auc = roc_auc_score(y_true, norm_scores)
        cm = confusion_matrix(y_true, pred_flags)

        synthetic_eval = {
            "precision": float(round(p, 4)),
            "recall": float(round(r, 4)),
            "f1_score": float(round(f1, 4)),
            "roc_auc": float(round(auc, 4)),
            "confusion_matrix": cm.tolist(),
        }

        print("\n[4] SYNTHETIC BENCHMARK PERFORMANCE (CALIBRATION ONLY)")
        print("  ! NOTICE: Based on synthetic development data; NOT real-world accuracy.")
        print(f"  - Synthetic Ground Truth Anomalies: {np.sum(y_true)} / {len(y_true)}")
        print(f"  - Precision: {p:.4f}")
        print(f"  - Recall:    {r:.4f}")
        print(f"  - F1-Score:  {f1:.4f}")
        print(f"  - ROC-AUC:   {auc:.4f}")
        print("\n  Confusion Matrix (rows=actual synthetic, cols=predicted):")
        print(f"    [[TN={cm[0,0]}, FP={cm[0,1]}],")
        print(f"     [FN={cm[1,0]}, TP={cm[1,1]}]]")

    print("\n" + "=" * 65)
    print("Evaluation completed successfully.")
    print("=" * 65 + "\n")

    return {
        "total_records": len(df),
        "score_distribution": score_stats,
        "risk_distribution": risk_stats,
        "synthetic_benchmark": synthetic_eval,
    }


if __name__ == "__main__":
    evaluate_pipeline()
