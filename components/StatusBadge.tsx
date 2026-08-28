import { getStatusConfig } from "@/lib/utils";
import { type ProjectStatus } from "@/lib/mockData";

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span
      role="status"
      aria-label={`Status: ${config.label}`}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderColor: config.dotColor + "40",
      }}
    >
      <span
        className="status-dot"
        aria-hidden="true"
        style={{ backgroundColor: config.dotColor }}
      />
      {config.label}
    </span>
  );
}

// Separate component for review status
interface ReviewStatusBadgeProps {
  status: string;
}

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    "pending": { bg: "#FFF7E8", text: "#B45309", label: "Pending Review" },
    "reviewed": { bg: "#EAF7EE", text: "#138808", label: "Reviewed" },
    "approved": { bg: "#D1FAE5", text: "#065F46", label: "Approved" },
    "reassessment-requested": { bg: "#FFF1F1", text: "#DC2626", label: "Reassessment Requested" },
    "Pending review": { bg: "#FFF7E8", text: "#B45309", label: "Pending Review" },
    "Reviewed": { bg: "#EAF7EE", text: "#138808", label: "Reviewed" },
  };

  const config = map[status] ?? { bg: "#F3F4F6", text: "#6B7280", label: status };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}

// Stage status badge
interface StageStatusBadgeProps {
  status: "completed" | "active" | "pending" | "blocked";
}

export function StageStatusBadge({ status }: StageStatusBadgeProps) {
  const map = {
    completed: { bg: "#EAF7EE", text: "#138808", label: "Completed" },
    active: { bg: "#EBF5FF", text: "#1D4ED8", label: "Active" },
    pending: { bg: "#F3F4F6", text: "#6B7280", label: "Pending" },
    blocked: { bg: "#FFF1F1", text: "#DC2626", label: "Blocked" },
  };

  const config = map[status];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
