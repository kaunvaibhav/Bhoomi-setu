import { ReactNode } from "react";
import { FolderOpen, AlertTriangle, FileX, Bell } from "lucide-react";

interface EmptyStateProps {
  type?: "no-data" | "no-results" | "no-alerts" | "no-documents" | "custom";
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({
  type = "no-data",
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  const defaults = {
    "no-data": {
      icon: <FolderOpen size={32} className="text-gray-300" />,
      title: "No records found",
      description: "There are no records to display at this time.",
    },
    "no-results": {
      icon: <FileX size={32} className="text-gray-300" />,
      title: "No projects match your filters",
      description: "Try adjusting your filters or search terms to see more results.",
    },
    "no-alerts": {
      icon: <Bell size={32} className="text-gray-300" />,
      title: "No active alerts",
      description: "All cases are within expected parameters.",
    },
    "no-documents": {
      icon: <FolderOpen size={32} className="text-gray-300" />,
      title: "No documents found",
      description: "No documents have been uploaded for this record yet.",
    },
    "custom": {
      icon: icon ?? <AlertTriangle size={32} className="text-gray-300" />,
      title: title ?? "Nothing here",
      description: description ?? "",
    },
  };

  const config = defaults[type];

  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="mb-4 opacity-60">{icon ?? config.icon}</div>
      <p className="text-sm font-semibold text-gray-500 mb-1">{title ?? config.title}</p>
      <p className="text-xs text-gray-400 max-w-xs leading-relaxed">{description ?? config.description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
