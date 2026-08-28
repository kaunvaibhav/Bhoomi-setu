// Mock API service — simulates async data fetching.
// All responses use illustrative prototype data.
// In production, replace these with authorised API calls.

import {
  SAMPLE_PROJECTS,
  NATIONAL_KPIS,
  FLAGGED_PARCELS,
  CITIZEN_CASE,
  DASHBOARD_ALERTS,
  VALUATION_KPIS,
  type Project,
  type UserRole,
} from "./mockData";

function delay(ms: number = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Projects
export async function fetchProjects(): Promise<Project[]> {
  await delay(500);
  return SAMPLE_PROJECTS;
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  await delay(400);
  return SAMPLE_PROJECTS.find((p) => p.id === id) ?? null;
}

// KPIs
export async function fetchNationalKpis() {
  await delay(600);
  return NATIONAL_KPIS;
}

// Alerts
export async function fetchAlerts() {
  await delay(300);
  return DASHBOARD_ALERTS;
}

// Valuation
export async function fetchFlaggedParcels() {
  await delay(500);
  return FLAGGED_PARCELS;
}

export async function fetchValuationKpis() {
  await delay(400);
  return VALUATION_KPIS;
}

export async function markParcelReviewed(parcelId: string): Promise<{ success: boolean; message: string }> {
  await delay(800);
  return {
    success: true,
    message: `Parcel ${parcelId} marked as reviewed. Record logged with officer signature.`,
  };
}

export async function requestReassessment(parcelId: string, note: string): Promise<{ success: boolean; refId: string }> {
  await delay(900);
  return {
    success: true,
    refId: `REQ-${Date.now().toString().slice(-6)}`,
  };
}

// Citizen case
export async function fetchCitizenCase(caseId: string) {
  await delay(700);
  if (caseId.trim().toUpperCase() === "BS-UP-2026-004821") {
    return CITIZEN_CASE;
  }
  return null;
}

// Proposal submission
export async function submitProposal(data: Record<string, unknown>): Promise<{ success: boolean; refId: string }> {
  await delay(1200);
  return {
    success: true,
    refId: "BS-PROP-2026-00124",
  };
}

// Role-based dashboard data
export async function fetchDashboardForRole(role: UserRole) {
  await delay(500);
  const base = {
    kpis: NATIONAL_KPIS,
    projects: SAMPLE_PROJECTS,
    alerts: DASHBOARD_ALERTS,
  };

  if (role === "district") {
    return {
      ...base,
      projects: SAMPLE_PROJECTS.filter((p) => p.state === "Uttar Pradesh"),
      title: "District Overview — Varanasi",
    };
  }

  if (role === "pia") {
    return {
      ...base,
      projects: SAMPLE_PROJECTS.filter((p) => p.requiringBody === "National Highways Authority of India"),
      title: "PIA Dashboard — NHAI",
    };
  }

  if (role === "state") {
    return {
      ...base,
      projects: SAMPLE_PROJECTS.filter((p) => p.state === "Uttar Pradesh" || p.state === "Maharashtra"),
      title: "State Overview",
    };
  }

  return { ...base, title: "National Acquisition Overview" };
}

export async function exportReport(): Promise<{ success: boolean; url: string }> {
  await delay(1500);
  return { success: true, url: "#" };
}
