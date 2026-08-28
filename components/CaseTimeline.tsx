import { WORKFLOW_STAGES } from "@/lib/workflowStages";
import { CheckCircle, Clock, Circle, AlertCircle, Brain, FileText } from "lucide-react";

interface StageInfo {
  stageId: number;
  status: "completed" | "active" | "pending" | "blocked";
  completedDate?: string;
  notes?: string;
  nextAction?: string;
}

interface CaseTimelineProps {
  stages: StageInfo[];
  citizenView?: boolean;
}

function StageIcon({ status }: { status: StageInfo["status"] }) {
  switch (status) {
    case "completed": return <CheckCircle size={18} className="text-[#138808]" />;
    case "active": return <Clock size={18} className="text-[#1F3864]" />;
    case "blocked": return <AlertCircle size={18} className="text-red-500" />;
    default: return <Circle size={18} className="text-gray-300" />;
  }
}

export default function CaseTimeline({ stages, citizenView = false }: CaseTimelineProps) {
  return (
    <div className="space-y-0" role="list" aria-label="Case lifecycle stages">
      {WORKFLOW_STAGES.map((stageDef, idx) => {
        const stageInfo = stages.find((s) => s.stageId === stageDef.id) ?? {
          stageId: stageDef.id,
          status: "pending" as const,
        };
        const isLast = idx === WORKFLOW_STAGES.length - 1;

        const bgColor = {
          completed: "#EAF7EE",
          active: "#EBF5FF",
          blocked: "#FFF1F1",
          pending: "#F9FAFB",
        }[stageInfo.status];

        const borderColor = {
          completed: "#138808",
          active: "#1F3864",
          blocked: "#EF4444",
          pending: "#E5E7EB",
        }[stageInfo.status];

        return (
          <div key={stageDef.id} className="flex gap-3" role="listitem">
            {/* Timeline */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div aria-hidden="true"><StageIcon status={stageInfo.status} /></div>
              {!isLast && (
                <div
                  className="w-px flex-1 mt-1"
                  style={{
                    backgroundColor: stageInfo.status === "completed" ? "#138808" : "#E5E7EB",
                    minHeight: "2.5rem",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Card */}
            <div
              className={`flex-1 mb-4 rounded-xl border p-3.5 ${isLast ? "mb-0" : ""}`}
              style={{ backgroundColor: bgColor, borderColor }}
              aria-label={`Stage ${stageDef.id}: ${stageDef.label} — ${stageInfo.status}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Stage {stageDef.id}</span>
                    {stageDef.isAiCheckpoint && !citizenView && (
                      <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                        <Brain size={8} /> AI Check
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{
                      color: stageInfo.status === "pending" ? "#9CA3AF" : "#1F3864",
                    }}
                  >
                    {stageDef.label}
                  </p>

                  {stageInfo.status !== "pending" && (
                    <>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        {citizenView
                          ? stageDef.description
                          : stageInfo.notes ?? stageDef.description}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{stageDef.responsibleAuthority}</p>
                    </>
                  )}

                  {/* Citizen-friendly AI note */}
                  {stageDef.isAiCheckpoint && citizenView && stageInfo.status === "active" && (
                    <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-[11px] text-blue-800 leading-snug">
                        Your compensation assessment is undergoing an additional verification step. This review is intended to improve accuracy and does not itself change your legal entitlement.
                      </p>
                    </div>
                  )}

                  {stageInfo.nextAction && stageInfo.status === "active" && (
                    <div className="mt-2">
                      <p className="text-[10px] text-[#1F3864] font-semibold">
                        Next action: {stageInfo.nextAction}
                      </p>
                    </div>
                  )}
                </div>

                {stageInfo.completedDate && stageInfo.completedDate !== "—" && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-gray-400">Completed</p>
                    <p className="text-[11px] font-medium text-gray-600">{stageInfo.completedDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
