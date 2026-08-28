import { type ProjectStatus } from "./mockData";

export function formatCurrency(amount: number, unit: "cr" | "lakh" | "raw" = "raw"): string {
  if (unit === "cr") {
    return `₹${amount.toLocaleString("en-IN")} Cr`;
  }
  if (unit === "lakh") {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatArea(hectares: number): string {
  return `${hectares.toLocaleString("en-IN")} ha`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getStatusConfig(status: ProjectStatus): {
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
} {
  switch (status) {
    case "on-track":
      return {
        label: "On Track",
        bgColor: "#EAF7EE",
        textColor: "#138808",
        dotColor: "#138808",
      };
    case "in-progress":
      return {
        label: "In Progress",
        bgColor: "#EBF5FF",
        textColor: "#1D4ED8",
        dotColor: "#3B82F6",
      };
    case "at-risk":
      return {
        label: "At Risk",
        bgColor: "#FFF7E8",
        textColor: "#B45309",
        dotColor: "#F59E0B",
      };
    case "delayed":
      return {
        label: "Delayed",
        bgColor: "#FFF1F1",
        textColor: "#DC2626",
        dotColor: "#EF4444",
      };
    case "completed":
      return {
        label: "Completed",
        bgColor: "#D1FAE5",
        textColor: "#065F46",
        dotColor: "#059669",
      };
    default:
      return {
        label: "Unknown",
        bgColor: "#F3F4F6",
        textColor: "#6B7280",
        dotColor: "#9CA3AF",
      };
  }
}

export function getAnomalyColor(score: number): string {
  if (score >= 70) return "#DC2626";
  if (score >= 50) return "#D97706";
  if (score >= 30) return "#2563EB";
  return "#138808";
}

export function getAnomalyLabel(score: number): string {
  if (score >= 70) return "High";
  if (score >= 50) return "Medium";
  if (score >= 30) return "Low";
  return "Normal";
}

export function truncate(str: string, length: number = 40): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStageName(stageId: number): string {
  const stages = [
    "Project Proposal",
    "Preliminary Scrutiny",
    "Social Impact Assessment",
    "Section 11 Notification",
    "Objection Hearing",
    "Declaration",
    "Survey and Measurement",
    "Award Declaration",
    "Compensation Disbursement",
    "Possession",
    "Rehabilitation & Resettlement",
    "Project Handover",
  ];
  return stages[stageId - 1] ?? "Unknown";
}

export function calculateProgress(acquired: number, required: number): number {
  if (required === 0) return 0;
  return Math.min(100, Math.round((acquired / required) * 100));
}
