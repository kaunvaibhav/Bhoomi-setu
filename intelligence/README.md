# BhoomiSetu Intelligence Engine

> **BhoomiSetu (भूमि सेतु) — Standalone AI/ML Decision Intelligence Module**  
> *Real-Time National Land Acquisition & Management System (Smart India Hackathon 2026 Prototype)*

---

## 1. Objective

The **BhoomiSetu Intelligence Engine** is a dedicated, decoupled analytical layer engineered to support revenue officers, district collectors, and land acquisition administrators. It applies machine learning and multi-criteria decision modeling to:
1. **Identify potential compensation valuation anomalies** by comparing declared compensation against statutory circle rates, local transaction comparables, and multi-year historical benchmarks.
2. **Quantify multi-dimensional operational risk** stemming from statutory milestone delays, citizen grievance density under Section 15, documentation deficits, and Rehabilitation & Resettlement (R&R) implementation lags.
3. **Generate non-technical, human-interpretable explanations** that clarify *why* a particular case was flagged.
4. **Assist administrative decision-making** with prioritized manual review recommendations, without replacing human legal judgment.

> [!IMPORTANT]
> **Decision-Support Notice & Governance Protocol:**
> This system is strictly a **decision-support tool**. It **NEVER** claims or proves fraud, corruption, illegality, or official misconduct. Flagged anomalies indicate unusual statistical variances or operational risks that warrant due diligence and qualitative review by an authorized revenue authority.

---

## 2. Architecture & Decision Flow

```
Synthetic / Government Data
        ↓
Data Validation (Schema & Bounds)
        ↓
Feature Engineering (Statutory Ratios & Delays)
        ↓
Preprocessing (ColumnTransformer & RobustScaler)
        ↓
AI / ML Models
        ↓
Anomaly Detection (IsolationForest: 0–100)
        ↓
Risk Scoring (Multi-Factor Composite: 0–100)
        ↓
Explainability (Human-Readable Evidence Generation)
        ↓
Officer Decision Support
```

---

## 3. Module Structure

```
intelligence/
│
├── README.md                      # Comprehensive documentation and runbook
├── requirements.txt               # Minimal required Python dependencies
├── .gitignore                     # Git ignore rules for virtual environments & artifacts
├── config.py                      # Global configuration, thresholds, and paths
│
├── data/
│   ├── README.md                  # Synthetic data provenance & privacy disclaimer
│   ├── generate_dataset.py        # Deterministic synthetic data generator (seed=42)
│   └── sample_land_acquisition.csv# Pre-generated 2,500 record sample dataset
│
├── preprocessing/
│   ├── __init__.py
│   └── pipeline.py                # Schema validation, range verification, and ColumnTransformer
│
├── features/
│   ├── __init__.py
│   └── engineering.py             # 10 domain-specific statutory features
│
├── models/
│   ├── __init__.py
│   ├── anomaly_detector.py        # Calibrated IsolationForest valuation anomaly detector
│   └── risk_model.py              # Multi-criteria operational risk model (LOW to CRITICAL)
│
├── training/
│   ├── __init__.py
│   └── train.py                   # Automated end-to-end model training and artifact serializer
│
├── inference/
│   ├── __init__.py
│   └── predict.py                 # Single and batch prediction pipeline with JSON contract
│
├── evaluation/
│   ├── __init__.py
│   └── metrics.py                 # Distribution statistics and benchmark evaluation metrics
│
├── explainability/
│   ├── __init__.py
│   └── explanations.py            # Non-technical administrative narratives & top factors
│
├── utils/
│   ├── __init__.py
│   └── logger.py                  # Standardized Python logging utility
│
├── artifacts/
│   └── .gitkeep                   # Directory for serialized joblib and metadata models
│
└── notebooks/
    └── README.md                  # Roadmap for exploratory Jupyter notebooks
```

---

## 4. Synthetic Development Dataset

The module operates with a deterministic, mathematically modeled synthetic dataset of 2,500 parcel acquisition cases (`sample_land_acquisition.csv`).

### Privacy and Governance
- **Zero PII**: No real citizen names, phone numbers, bank details, or Aadhaar numbers are utilized.
- **Statutory Realism**: Generated values adhere to macro-economic principles under the **RFCTLARR Act, 2013** (Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013).
- **Distribution Profiles**:
  - **Normal Cases (~80%)**: Awards conforming closely to circle rates + rural/urban multipliers + 100% statutory solatium.
  - **Moderately Unusual Cases (~12%)**: Cases with moderate valuation variance or intermediate procedural delay.
  - **Strongly Anomalous Cases (~8%)**: Significant over/under-valuations, elevated objection volume, documentation gaps, or stalled R&R milestones.

---

## 5. Feature Engineering

The pipeline deterministically derives 10 administrative indicators:

| # | Derived Feature | Statutory / Operational Rationale |
|---|---|---|
| 1 | `compensation_to_circle_rate_ratio` | Compares declared compensation per acre against government circle rates. Statutory norms typically expect 2.0x–4.0x (including multipliers and solatium). |
| 2 | `compensation_to_market_ratio` | Compares declared unit rate against average registered deed transactions in the vicinity. |
| 3 | `compensation_deviation_percent` | Percentage divergence of declared award from local median transaction values. |
| 4 | `historical_value_deviation` | Divergence from 3-year historical revenue benchmarks to flag sudden price surges. |
| 5 | `pending_delay_score` | Standardized index of processing duration against statutory lapse risk (e.g. Section 25). |
| 6 | `document_completeness_score` | Quantifies dossier verification integrity (field sketches, titles, SIA reports). |
| 7 | `objection_density` | Formal Section 15 objections filed per affected family. |
| 8 | `r_and_r_completion_score` | Rehabilitation & Resettlement milestone compliance percentage. |
| 9 | `infrastructure_proximity_factor` | Accounts for proximity to national freight/highway corridors justifying legitimate premiums. |
| 10 | `project_progress_indicator` | Ordinal scale (0–100) benchmark representing statutory stage progression. |

---

## 6. Machine Learning Models

### Model 1: Valuation Anomaly Detector (`models/anomaly_detector.py`)
- **Algorithm**: `IsolationForest` (scikit-learn) with contamination factor 0.10.
- **Features Used**: Valuation ratios, market deviation, circle rate ratios, distance to comparables, and infrastructure proximity.
- **Calibrated Scoring**: Normalized into a standardized **0–100 scale**:
  - `0`: Highly standard statutory valuation pattern.
  - `100`: Statistically anomalous compensation / valuation pattern.
- **Flagging**: Configurable threshold (default: `>= 65.0`).
- **Terminology**: Labels anomalies as *"Potential valuation anomaly — manual review recommended"*.

### Model 2: Acquisition Risk Model (`models/risk_model.py`)
- **Algorithm**: Transparent, multi-criteria decision model.
- **Risk Dimensions**:
  - Valuation Anomaly Score (Weight: 35%)
  - Procedural & Milestone Delay (Weight: 20%)
  - Citizen Objections & Grievances (Weight: 15%)
  - Documentation Incompleteness (Weight: 15%)
  - R&R Implementation Deficit (Weight: 15%)
- **Tiers**:
  - `LOW`: 0.0 – 24.9
  - `MEDIUM`: 25.0 – 49.9
  - `HIGH`: 50.0 – 74.9
  - `CRITICAL`: 75.0 – 100.0

---

## 7. Explainability & Human-in-the-Loop Protocol

Every model prediction is coupled with human-readable explanations generated by `explainability/explanations.py`.

### Example Prediction Output
```json
{
  "parcel_id": "BS-PARCEL-DEMO-02",
  "anomaly": {
    "score": 87.4,
    "flag": true
  },
  "risk": {
    "score": 78.2,
    "level": "CRITICAL"
  },
  "top_factors": [
    "Declared compensation is 142% higher than nearby registered transaction averages",
    "Case has remained pending for 680 days, approaching statutory timeline boundaries under RFCTLARR Act",
    "Multiple formal Section 15 objections registered (14 objections across 12 affected families)",
    "Rehabilitation & Resettlement (R&R) scheme implementation is lagging behind the current statutory acquisition milestone"
  ],
  "recommendation": "Manual review recommended by Competent Authority / Collector before award confirmation"
}
```

---

## 8. Setup & Running Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Terminal / PowerShell

### Step-by-Step Execution

Navigate to the `intelligence` directory or invoke as modules from project root:

```bash
# 1. Navigate into the intelligence directory
cd intelligence

# 2. (Optional) Create and activate a virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On Linux / macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Generate Synthetic Dataset (if regenerating)
python data/generate_dataset.py

# 5. Run Model Training Pipeline
python -m training.train

# 6. Run Sample Inference
python -m inference.predict

# 7. Run Evaluation & Metric Benchmarking
python -m evaluation.metrics
```

---

## 9. Current Limitations & Synthetic Notice

> **Important Disclosure:**  
> The current implementation uses **synthetic development data** and operates **completely independently** from the BhoomiSetu web application.
> 
> - Numerical models have been trained and evaluated solely on synthetic distributions for demonstration and structural validation.
> - Metrics produced during evaluation verify algorithm mechanics and stability; they do not reflect operational accuracy on real district land acquisition dossiers.
> - The module does not touch, modify, or depend upon the existing Next.js frontend or backend.

---

## 10. Future Integration Roadmap

In subsequent phases of BhoomiSetu, this engine can be exposed as an asynchronous microservice or serverless decision-intelligence API:

```
BhoomiSetu Application
        ↓
Backend API
        ↓
Intelligence Service (FastAPI / gRPC)
        ↓
Feature Processing Pipeline
        ↓
ML Models (IsolationForest & Risk Model)
        ↓
Risk + Anomaly Results + Top Factors
        ↓
BhoomiSetu Dashboard (/valuation-review & /dashboard)
```

---

*BhoomiSetu Land Acquisition Intelligence Prototype · Smart India Hackathon 2026*
