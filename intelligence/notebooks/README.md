# Exploratory Notebooks

This directory is reserved for interactive Jupyter notebooks used during research and exploratory data analysis (EDA) for the BhoomiSetu Land Acquisition Intelligence pipeline.

## Suggested Notebooks
- `01_exploratory_data_analysis.ipynb`: Data distribution inspection, correlation heatmaps, and outlier identification.
- `02_anomaly_detection_experiments.ipynb`: Tuning IsolationForest contamination parameters and scoring calibration.
- `03_risk_scoring_validation.ipynb`: Testing risk factor weights, score distributions, and stress-testing edge cases.

## Notes
- All experiments in this folder should remain decoupled from production modules.
- Reusable logic developed here should be ported directly into `features/`, `models/`, or `evaluation/`.
