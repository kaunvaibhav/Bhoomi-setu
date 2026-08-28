"use client";

import { WORKFLOW_STAGES } from "@/lib/workflowStages";
import { type StageProgress } from "@/lib/workflowStages";
import { CheckCircle, Circle, Clock, AlertCircle, Brain } from "lucide-react";

interface ProcessStepperProps {
  currentStage?: number;
  stageProgresses?: StageProgress[];
  orientation?: "horizontal" | "vertical";
  compact?: boolean;
}

function getStageIcon(status: StageProgress["status"]) {
  switch (status) {
    case "completed": return <CheckCircle size={16} className="text-white" />;
    case "active": return <Clock size={16} className="text-white" />;
    case "blocked": return <AlertCircle size={16} className="text-white" />;
    default: return <Circle size={16} className="text-gray-400" />;
  }
}

function getStageColors(status: StageProgress["status"]) {
  switch (status) {
    case "completed": return { bg: "#138808", border: "#138808", connector: "#138808" };
    case "active": return { bg: "#1F3864", border: "#1F3864", connector: "#E5E7EB" };
    case "blocked": return { bg: "#DC2626", border: "#DC2626", connector: "#E5E7EB" };
    default: return { bg: "#E5E7EB", border: "#E5E7EB", connector: "#E5E7EB" };
  }
}

export default function ProcessStepper({
  currentStage,
  stageProgresses,
  orientation = "horizontal",
  compact = false,
}: ProcessStepperProps) {
  const getStatus = (stageId: number): StageProgress => {
    if (stageProgresses) {
      return stageProgresses.find((s) => s.stageId === stageId) ?? { stageId, status: "pending" };
    }
    // Landing page mode — just show the stages numbered
    return { stageId, status: "pending" };
  };

  if (orientation === "vertical") {
    return (
      <div className="space-y-0" role="list" aria-label="12-stage land acquisition lifecycle">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const progress = getStatus(stage.id);
          const colors = getStageColors(progress.status);
          const isLast = idx === WORKFLOW_STAGES.length - 1;

          return (
            <div key={stage.id} className="flex gap-3" role="listitem">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                  style={{ backgroundColor: colors.bg, border: `2px solid ${colors.border}` }}
                  aria-hidden="true"
                >
                  {getStageIcon(progress.status)}
                </div>
                {!isLast && (
                  <div
                    className="w-0.5 flex-1 mt-1"
                    style={{ backgroundColor: colors.connector, minHeight: "2rem" }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-sm font-semibold leading-tight"
                      style={{ color: progress.status === "active" ? "#1F3864" : progress.status === "completed" ? "#333" : "#9CA3AF" }}
                    >
                      {stage.id}. {stage.label}
                    </p>
                    {!compact && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{stage.description}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">{stage.responsibleAuthority}</p>
                    {progress.completedDate && progress.completedDate !== "—" && (
                      <p className="text-[10px] text-green-600 mt-0.5">Completed: {progress.completedDate}</p>
                    )}
                    {progress.nextAction && (
                      <p className="text-[10px] text-blue-600 mt-0.5 font-medium">Next: {progress.nextAction}</p>
                    )}
                  </div>
                  {stage.isAiCheckpoint && (
                    <div className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[10px] font-medium text-purple-700">
                      <Brain size={9} />
                      AI Check
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

  // Horizontal stepper (landing page)
  return (
    <div className="stepper-scroll pb-4" role="list" aria-label="12-stage land acquisition lifecycle">
      <div className="flex items-start min-w-max gap-0">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isLast = idx === WORKFLOW_STAGES.length - 1;
          const isAiStage = stage.isAiCheckpoint;

          return (
            <div key={stage.id} className="flex items-start" role="listitem">
              {/* Stage node + content */}
              <div className="flex flex-col items-center w-32">
                {/* Node */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mb-2 relative ${
                    isAiStage ? "ring-2 ring-purple-400 ring-offset-2" : ""
                  }`}
                  style={{
                    backgroundColor: currentStage && stage.id < currentStage ? "#138808" : currentStage === stage.id ? "#1F3864" : "#E5E7EB",
                    color: currentStage && stage.id <= currentStage ? "white" : "#9CA3AF",
                  }}
                  aria-current={currentStage === stage.id ? "step" : undefined}
                >
                  {stage.id}
                  {isAiStage && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center" aria-label="AI checkpoint">
                      <Brain size={8} className="text-white" />
                    </span>
                  )}
                </div>
                {/* Label */}
                <p className="text-[11px] font-semibold text-center text-gray-700 leading-tight mb-1">
                  {stage.shortLabel}
                </p>
                <p className="text-[9px] text-gray-500 text-center leading-tight px-1">
                  {stage.responsibleAuthority.split("/")[0].trim()}
                </p>
                {isAiStage && (
                  <div className="mt-1 px-1.5 py-0.5 rounded-full bg-purple-100 text-[8px] font-bold text-purple-700 text-center">
                    AI Review
                  </div>
                )}
              </div>

              {/* Connector */}
              {!isLast && (
                <div
                  className="h-0.5 w-6 mt-5 flex-shrink-0"
                  style={{
                    backgroundColor: currentStage && stage.id < currentStage ? "#138808" : "#E5E7EB",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
