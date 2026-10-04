"""
BhoomiSetu Land Acquisition Intelligence - Explainability & Decision Support
Converts quantitative statistical metrics into clear, non-technical administrative narratives.

COMPLIANCE & GOVERNANCE:
Strictly adheres to decision-support terminology. Does NOT accuse or declare fraud,
corruption, or misconduct. Translates statistical divergences into neutral administrative
observations that assist land acquisition officers and collectors in targeted due diligence.
"""

from typing import Any, Dict, List, Optional
import pandas as pd


def generate_case_explanation(
    case_row: pd.Series,
    anomaly_score: float,
    anomaly_flag: bool,
    risk_score: float,
    risk_level: str,
    component_breakdown: Optional[Dict[str, float]] = None,
) -> Dict[str, Any]:
    """
    Synthesizes human-readable decision factors and officer recommendations.

    Args:
        case_row: Series containing raw and engineered case attributes.
        anomaly_score: Normalized anomaly score (0-100).
        anomaly_flag: Boolean indicating whether valuation anomaly threshold was triggered.
        risk_score: Composite risk score (0-100).
        risk_level: Standardized tier ("LOW", "MEDIUM", "HIGH", "CRITICAL").
        component_breakdown: Optional dictionary of individual risk sub-scores.

    Returns:
        Dictionary containing:
            - 'top_factors': Ranked list of primary contributing administrative observations.
            - 'recommendation': Actionable guidance string for the reviewing officer.
            - 'administrative_summary': Comprehensive narrative paragraph.
    """
    candidate_factors: List[Dict[str, Any]] = []

    # 1. Valuation & Market Comparison Insights
    comp_to_market = float(case_row.get("compensation_to_market_ratio", 1.0))
    comp_to_circle = float(case_row.get("compensation_to_circle_rate_ratio", 2.0))
    hist_dev = float(case_row.get("historical_value_deviation", 0.0))

    if comp_to_market >= 1.65:
        severity = min(100.0, (comp_to_market - 1.0) * 50.0)
        pct_above = int(round((comp_to_market - 1.0) * 100))
        candidate_factors.append({
            "severity": severity,
            "text": f"Declared compensation is {pct_above}% higher than nearby registered transaction averages",
        })
    elif comp_to_market <= 0.65:
        severity = min(100.0, (1.0 - comp_to_market) * 80.0)
        pct_below = int(round((1.0 - comp_to_market) * 100))
        candidate_factors.append({
            "severity": severity,
            "text": f"Declared compensation is {pct_below}% below local transaction comparables (potential under-compensation risk)",
        })

    if comp_to_circle >= 4.2:
        candidate_factors.append({
            "severity": 75.0,
            "text": f"Unit compensation ({comp_to_circle:.2f}x circle rate) significantly exceeds standard statutory multiplier benchmarks",
        })
    elif comp_to_circle <= 1.4:
        candidate_factors.append({
            "severity": 70.0,
            "text": f"Unit compensation ({comp_to_circle:.2f}x circle rate) is unusually close to base circle rate without standard statutory additions",
        })

    if hist_dev >= 80.0:
        candidate_factors.append({
            "severity": 65.0,
            "text": f"Valuation reflects a sharp upward variance ({int(hist_dev)}%) relative to 3-year historical revenue benchmarks",
        })

    # 2. Procedural & Statutory Delay Insights
    pending_days = int(case_row.get("pending_days", 0))
    if pending_days >= 500:
        candidate_factors.append({
            "severity": min(100.0, pending_days / 730.0 * 90.0),
            "text": f"Case has remained pending for {pending_days} days, approaching statutory timeline boundaries under RFCTLARR Act",
        })
    elif pending_days >= 300:
        candidate_factors.append({
            "severity": 45.0,
            "text": f"Processing duration ({pending_days} days) is elevated relative to average district turnaround",
        })

    # 3. Citizen Grievance & Public Objections
    objection_count = int(case_row.get("objection_count", 0))
    affected_families = int(case_row.get("affected_family_count", 1))
    objection_density = float(case_row.get("objection_density", 0.0))

    if objection_count >= 10 or objection_density >= 0.35:
        candidate_factors.append({
            "severity": min(100.0, 50.0 + objection_count * 2.0),
            "text": f"Multiple formal Section 15 objections registered ({objection_count} objections across {affected_families} affected families)",
        })
    elif objection_count >= 4:
        candidate_factors.append({
            "severity": 40.0,
            "text": f"Several formal objections filed ({objection_count} pending hearings)",
        })

    # 4. Dossier & Documentation Completeness
    doc_completeness = float(case_row.get("document_completeness", 1.0))
    if doc_completeness < 0.70:
        missing_pct = int(round((1.0 - doc_completeness) * 100))
        candidate_factors.append({
            "severity": 70.0,
            "text": f"Dossier completeness is deficient ({missing_pct}% of requisite revenue verifications or certificates pending)",
        })
    elif doc_completeness < 0.85:
        candidate_factors.append({
            "severity": 35.0,
            "text": f"Minor documentation gaps identified ({int(doc_completeness * 100)}% verified)",
        })

    # 5. Rehabilitation & Resettlement (R&R) Alignment
    randr_progress = float(case_row.get("r_and_r_progress", 1.0))
    stage_prog = float(case_row.get("project_progress_indicator", 50.0)) / 100.0
    if stage_prog >= 0.60 and randr_progress < 0.40:
        candidate_factors.append({
            "severity": 80.0,
            "text": "Rehabilitation & Resettlement (R&R) scheme implementation is lagging behind the current statutory acquisition milestone",
        })

    # Rank factors by severity (descending)
    candidate_factors.sort(key=lambda x: x["severity"], reverse=True)
    top_factors = [f["text"] for f in candidate_factors[:4]]

    if not top_factors:
        top_factors = [
            "Compensation aligns with local transaction medians and statutory benchmarks",
            "Procedural timelines and documentation comply with standard administrative guidelines",
        ]

    # Generate Administrative Recommendation & Summary
    if risk_level == "CRITICAL" or anomaly_score >= 80.0:
        recommendation = "Manual review recommended by Competent Authority / Collector before award confirmation"
        administrative_summary = (
            f"Case exhibits an elevated risk profile (Risk Score: {risk_score}/100, Tier: CRITICAL) with "
            f"potential valuation anomalies (Anomaly Index: {anomaly_score}/100). Prioritized administrative verification "
            f"is recommended before formal disbursement."
        )
    elif risk_level == "HIGH" or anomaly_flag:
        recommendation = "Valuation review advised by designated Revenue Officer"
        administrative_summary = (
            f"Case flagged for procedural and/or valuation review (Risk Score: {risk_score}/100, Tier: HIGH). "
            f"Key contributing factors indicate unusual variances that warrant secondary review."
        )
    elif risk_level == "MEDIUM":
        recommendation = "Routine administrative verification of pending milestones recommended"
        administrative_summary = (
            f"Case displays moderate operational friction (Risk Score: {risk_score}/100, Tier: MEDIUM). "
            f"Valuation metrics are largely within acceptable parameters."
        )
    else:
        recommendation = "Standard administrative processing may proceed"
        administrative_summary = (
            f"Case satisfies normative administrative parameters (Risk Score: {risk_score}/100, Tier: LOW). "
            f"Valuation and procedural metrics are consistent with standard district benchmarks."
        )

    return {
        "top_factors": top_factors,
        "recommendation": recommendation,
        "administrative_summary": administrative_summary,
    }
