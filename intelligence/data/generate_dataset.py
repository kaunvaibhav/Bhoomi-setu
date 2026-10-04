"""
BhoomiSetu Land Acquisition Intelligence - Synthetic Dataset Generator
Generates realistic, deterministic synthetic data for land-acquisition decision support.

COMPLIANCE & PRIVACY NOTE:
- Purely synthetic records generated via mathematical distributions and fixed random seeds.
- Zero personally identifiable information (PII), zero real Aadhaar, zero real land-records.
- Conforms to RFCTLARR Act 2013 macro-valuation principles for demonstration purposes.
"""

import sys
from pathlib import Path

# Add project root to sys.path if invoked directly
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
from intelligence.config import DATASET_PATH, RANDOM_SEED
from intelligence.utils.logger import get_logger

logger = get_logger("data_generator")


def generate_synthetic_dataset(
    n_samples: int = 2500,
    random_seed: int = RANDOM_SEED,
    output_path: Path = DATASET_PATH,
) -> pd.DataFrame:
    """
    Generates a reproducible synthetic dataset of land acquisition parcels.

    Args:
        n_samples: Total number of parcels to generate (default: 2500).
        random_seed: Deterministic RNG seed for complete reproducibility.
        output_path: Target path to write CSV file.

    Returns:
        pd.DataFrame containing generated records.
    """
    logger.info(f"Generating {n_samples} synthetic land acquisition records (seed={random_seed})...")
    rng = np.random.default_rng(random_seed)

    # Geographic simulation across prominent project corridors
    states_districts = {
        "Uttar Pradesh": ["Varanasi", "Lucknow", "Agra", "Prayagraj", "Gorakhpur"],
        "Maharashtra": ["Nagpur", "Pune", "Nashik", "Thane", "Aurangabad"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Bharuch"],
        "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
        "Karnataka": ["Bengaluru Rural", "Mysuru", "Tumakuru", "Belagavi"],
        "Tamil Nadu": ["Kanchipuram", "Coimbatore", "Salem", "Madurai"],
        "Odisha": ["Khordha", "Sambalpur", "Jharsuguda", "Cuttack"],
    }
    state_keys = list(states_districts.keys())

    land_types = ["Agricultural", "Non-Agricultural", "Commercial", "Industrial", "Barren"]
    land_type_probs = [0.55, 0.20, 0.12, 0.08, 0.05]

    land_uses = [
        "Irrigated Crop",
        "Dry Crop",
        "Commercial Hub",
        "Residential Zone",
        "Infrastructure Corridor",
    ]
    land_use_probs = [0.40, 0.30, 0.10, 0.10, 0.10]

    stages = [
        "Preliminary Notification (Sec 11)",
        "SIA Survey (Sec 4)",
        "Rehabilitation Scheme (Sec 16)",
        "Declaration (Sec 19)",
        "Enquiry & Award (Sec 23)",
        "Compensation Disbursement",
        "Possession Handover",
    ]
    stage_probs = [0.15, 0.15, 0.15, 0.20, 0.15, 0.10, 0.10]

    # Assign state and district
    chosen_states = rng.choice(state_keys, size=n_samples)
    chosen_districts = [rng.choice(states_districts[s]) for s in chosen_states]

    # Generate parcel IDs (format: BS-PARCEL-XXXXX)
    parcel_ids = [f"BS-PARCEL-{i:05d}" for i in range(1001, 1001 + n_samples)]

    # Land area (acres): log-normal distribution, clipped between 0.1 and 150.0 acres
    land_area = np.clip(rng.lognormal(mean=1.2, sigma=0.85, size=n_samples), 0.15, 120.0).round(2)

    # Categories
    chosen_land_types = rng.choice(land_types, size=n_samples, p=land_type_probs)
    chosen_land_uses = rng.choice(land_uses, size=n_samples, p=land_use_probs)
    chosen_stages = rng.choice(stages, size=n_samples, p=stage_probs)

    # Baseline Circle Rate per acre (INR): depends on land type
    base_circle_rate_map = {
        "Agricultural": 1_200_000,
        "Non-Agricultural": 2_800_000,
        "Commercial": 6_500_000,
        "Industrial": 4_800_000,
        "Barren": 650_000,
    }

    circle_rates = []
    for lt in chosen_land_types:
        base = base_circle_rate_map[lt]
        variation = rng.uniform(0.75, 1.35)
        circle_rates.append(round(base * variation, -3))
    circle_rates = np.array(circle_rates, dtype=float)

    # Market transaction data (comparables)
    # Nearby transactions typically track circle rate within 0.9x to 1.8x
    market_multipliers = rng.uniform(1.05, 1.45, size=n_samples)
    nearby_avg = np.round(circle_rates * market_multipliers, -3)
    nearby_median = np.round(nearby_avg * rng.uniform(0.94, 1.06, size=n_samples), -3)
    historical_avg = np.round(circle_rates * rng.uniform(0.85, 1.15, size=n_samples), -3)

    # Spatial and infrastructure indicators
    distance_to_nearest = np.clip(rng.exponential(scale=1.8, size=n_samples), 0.1, 25.0).round(2)
    infra_proximity_score = np.clip(rng.normal(loc=65.0, scale=18.0, size=n_samples), 5.0, 99.0).round(1)
    market_growth_rate = np.clip(rng.normal(loc=0.08, scale=0.04, size=n_samples), -0.05, 0.28).round(4)

    # Project operational metrics
    affected_families = np.clip(
        rng.poisson(lam=np.maximum(1, (land_area * 1.8).astype(int))), 0, 450
    )
    objection_count = np.clip(rng.poisson(lam=2.5, size=n_samples), 0, 60)
    pending_days = np.clip(rng.normal(loc=180, scale=110, size=n_samples), 10, 1100).astype(int)
    document_completeness = np.clip(rng.beta(a=8, b=2, size=n_samples), 0.20, 1.0).round(3)
    r_and_r_progress = np.clip(rng.beta(a=5, b=3, size=n_samples), 0.05, 1.0).round(3)

    # Compute baseline statutory compensation under RFCTLARR Act 2013:
    # Statutory compensation ~ (Market Value * Rural/Urban Multiplier [1.0 - 2.0] + 100% Solatium) * Land Area
    # Standard multiplication factor is 1.25 - 2.0x, solatium is 100% (2.0 factor total on base)
    statutory_base_per_acre = np.maximum(circle_rates, nearby_avg)
    solatium_multiplier = rng.uniform(2.0, 2.5, size=n_samples)
    baseline_total_comp = statutory_base_per_acre * land_area * solatium_multiplier

    # Allocate cases into 3 categories:
    # 1. Normal (~80%): Slight noise around statutory expectation
    # 2. Moderately unusual (~12%): Noticeable deviations in compensation or operational risk
    # 3. Strongly anomalous (~8%): Extreme valuation spikes, severe under-valuations, or severe operational friction
    case_types = rng.choice(
        ["normal", "moderate_anomaly", "strong_anomaly"],
        size=n_samples,
        p=[0.80, 0.12, 0.08],
    )

    declared_compensation = np.zeros(n_samples)

    for i in range(n_samples):
        ctype = case_types[i]
        if ctype == "normal":
            # Normal variance: 0.92 to 1.12
            noise = rng.uniform(0.92, 1.12)
            declared_compensation[i] = round(baseline_total_comp[i] * noise, -3)

        elif ctype == "moderate_anomaly":
            # Moderate anomaly: valuation mismatch (e.g. 1.6x - 2.2x or 0.6x - 0.75x) or moderate delays
            variation_type = rng.choice(["elevated_val", "deflated_val", "delay"])
            if variation_type == "elevated_val":
                declared_compensation[i] = round(baseline_total_comp[i] * rng.uniform(1.65, 2.3), -3)
            elif variation_type == "deflated_val":
                declared_compensation[i] = round(baseline_total_comp[i] * rng.uniform(0.55, 0.72), -3)
            else:
                declared_compensation[i] = round(baseline_total_comp[i] * rng.uniform(1.15, 1.4), -3)
                pending_days[i] = int(rng.uniform(400, 750))
                objection_count[i] = int(rng.uniform(12, 25))

        else:  # strong_anomaly
            anomaly_flavor = rng.choice(["extreme_overval", "extreme_underval", "operational_gridlock"])
            if anomaly_flavor == "extreme_overval":
                # Disproportionately high valuation compared to circle rate and market comps (e.g. 3.5x - 6.5x)
                declared_compensation[i] = round(baseline_total_comp[i] * rng.uniform(3.5, 6.5), -3)
                document_completeness[i] = round(rng.uniform(0.30, 0.65), 3)
            elif anomaly_flavor == "extreme_underval":
                # Disproportionately low valuation relative to statutory baseline (e.g. 0.25x - 0.45x)
                declared_compensation[i] = round(baseline_total_comp[i] * rng.uniform(0.25, 0.45), -3)
                objection_count[i] = int(rng.uniform(20, 50))
            else:
                # Operational gridlock: extreme objections, pending > 800 days, stalled R&R
                declared_compensation[i] = round(baseline_total_comp[i] * rng.uniform(1.8, 3.2), -3)
                pending_days[i] = int(rng.uniform(750, 1100))
                objection_count[i] = int(rng.uniform(28, 55))
                document_completeness[i] = round(rng.uniform(0.25, 0.55), 3)
                r_and_r_progress[i] = round(rng.uniform(0.05, 0.30), 3)

    # Assemble DataFrame
    df = pd.DataFrame(
        {
            "parcel_id": parcel_ids,
            "state": chosen_states,
            "district": chosen_districts,
            "land_area_acres": land_area,
            "land_type": chosen_land_types,
            "land_use": chosen_land_uses,
            "circle_rate_per_acre": circle_rates,
            "nearby_transaction_avg": nearby_avg,
            "nearby_transaction_median": nearby_median,
            "declared_compensation": declared_compensation,
            "historical_avg_value": historical_avg,
            "distance_to_nearest_transaction_km": distance_to_nearest,
            "infrastructure_proximity_score": infra_proximity_score,
            "market_growth_rate": market_growth_rate,
            "affected_family_count": affected_families,
            "objection_count": objection_count,
            "pending_days": pending_days,
            "document_completeness": document_completeness,
            "r_and_r_progress": r_and_r_progress,
            "acquisition_stage": chosen_stages,
            # Synthetic development label: used ONLY for evaluation validation in metrics.py
            # Models DO NOT train on this label (unsupervised / risk rule-based).
            "_synthetic_is_anomaly": (case_types != "normal").astype(int),
            "_synthetic_anomaly_type": case_types,
        }
    )

    # Save to CSV
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    logger.info(f"Successfully generated and wrote {len(df)} records to {output_path}")

    return df


if __name__ == "__main__":
    generate_synthetic_dataset()
