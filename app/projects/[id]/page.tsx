"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Map, Download, UserPlus, Clock, AlertTriangle, CheckSquare, Square, ThumbsUp, ThumbsDown, CheckCircle, FileText, MapPin, XCircle } from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import StatusBadge from "@/components/StatusBadge";
import ProcessStepper from "@/components/ProcessStepper";
import CaseTimeline from "@/components/CaseTimeline";
import DocumentList from "@/components/DocumentList";
import Modal from "@/components/Modal";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { SAMPLE_PROJECTS, type Project } from "@/lib/mockData";
import { generateStageProgress } from "@/lib/workflowStages";
import { formatArea, formatCurrency, calculateProgress } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { user, logout } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"lifecycle" | "documents" | "parcels">("lifecycle");
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  // Stage 2 Scrutiny checklist & states
  const [scrutinyChecks, setScrutinyChecks] = useState({
    dpr: false,
    boundaries: false,
    budget: false,
    records: false,
  });
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const found = SAMPLE_PROJECTS.find((p) => p.id === id);
    if (found) {
      setProject({ ...found });
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle size={40} className="text-amber-500" />
        <h1 className="text-xl font-bold text-[#1F3864]">Project not found</h1>
        <p className="text-sm text-gray-500 text-center">We could not load this project record. Please try again or contact the support desk.</p>
        <Link href="/dashboard" className="px-4 py-2 bg-[#1F3864] text-white rounded-xl text-sm font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const stageProgresses = generateStageProgress(project.currentStage, project.status);
  const acquisitionPct = calculateProgress(project.landAcquired, project.landRequired);
  const compensationPct = calculateProgress(project.compensationDisbursed, project.compensationAssessed);

  const toggleCheck = (key: keyof typeof scrutinyChecks) => {
    setScrutinyChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecksPassed = Object.values(scrutinyChecks).every(Boolean);

  const handleApproveScrutiny = () => {
    if (!allChecksPassed) return;
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentStage: 3, // SIA
        status: "on-track",
        lastUpdated: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
      };
    });
    addToast("success", "Preliminary Scrutiny passed. Proposal promoted to Stage 3: Social Impact Assessment (SIA).");
  };

  const handleRejectScrutiny = () => {
    if (!rejectionReason.trim()) {
      addToast("error", "Please provide a reason for the objection.");
      return;
    }
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentStage: 1, // Reset to Project Proposal
        status: "delayed",
        lastUpdated: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
        description: `${prev.description} [Rejected during Scrutiny: ${rejectionReason}]`,
      };
    });
    setRejectModalOpen(false);
    setRejectionReason("");
    addToast("info", "Proposal sent back to Project Implementing Agency (PIA) with objections.");
  };

  return (
    <ProtectedRoute>
      <TopUtilityBar />
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-8xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-[#1F3864] text-sm font-medium transition-colors flex-shrink-0">
                <ArrowLeft size={16} /> Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-700 font-medium truncate">{project.name}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <StatusBadge status={project.status} />
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
                title="Sign out of BhoomiSetu"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <main id="main-content" className="max-w-8xl mx-auto px-4 py-6 space-y-6">
          {/* Project header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{project.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EAF0F8] text-[#1F3864] font-semibold">{project.type}</span>
                  <StatusBadge status={project.status} size="sm" />
                </div>
                <h1 className="text-2xl font-bold text-[#1F3864] mb-1">{project.name}</h1>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
                  <MapPin size={14} />
                  <span>{project.district}, {project.state}</span>
                  <span className="text-gray-300">·</span>
                  <span>Requiring body: {project.requiringBody}</span>
                  <span className="text-gray-300">·</span>
                  <span>Last updated: {project.lastUpdated}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-2xl">{project.description}</p>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={() => setMapModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Map size={13} /> View on Map
                </button>
                <button
                  onClick={() => addToast("info", "Report download started")}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Download size={13} /> Download Brief
                </button>
                <button
                  onClick={() => addToast("success", "Officer assignment workflow opened")}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#1F3864] text-white rounded-xl text-xs font-medium hover:bg-[#2A4A8A] transition-colors"
                >
                  <UserPlus size={13} /> Assign Officer
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Land Required", value: formatArea(project.landRequired) },
                { label: "Land Notified", value: formatArea(project.landNotified) },
                { label: "Land Acquired", value: `${formatArea(project.landAcquired)} (${acquisitionPct}%)` },
                { label: "Affected Families", value: project.affectedFamilies.toLocaleString("en-IN") },
                { label: "Compensation Assessed", value: formatCurrency(project.compensationAssessed, "cr") },
                { label: "Disbursed", value: `${formatCurrency(project.compensationDisbursed, "cr")} (${compensationPct}%)` },
              ].map((item) => (
                <div key={item.label} className="bg-[#EAF0F8] rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-500 mb-0.5">{item.label}</p>
                  <p className="text-xs font-bold text-[#1F3864] leading-tight">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stage progress bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[#1F3864]">Acquisition Stage</p>
              <span className="text-xs text-gray-500">Stage {project.currentStage} of 12</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-2.5 rounded-sm"
                  style={{
                    backgroundColor: i < project.currentStage - 1 ? "#138808" : i === project.currentStage - 1 ? "#1F3864" : "#E5E7EB",
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-400">
              <span>Project Proposal</span>
              <span className="font-medium text-[#1F3864]">Stage {project.currentStage}: {stageProgresses.find(s => s.stageId === project.currentStage)?.status === 'active' ? 'Active' : ''}</span>
              <span>Project Handover</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {(["lifecycle", "documents", "parcels"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  activeTab === tab ? "bg-white text-[#1F3864] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                aria-pressed={activeTab === tab}
              >
                {tab === "lifecycle" ? "12-Stage Lifecycle" : tab === "documents" ? `Documents (${project.documents.length})` : `Parcels (${project.parcels.length})`}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "lifecycle" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <h2 className="text-sm font-semibold text-[#1F3864] mb-4">Case Lifecycle</h2>
                <CaseTimeline stages={stageProgresses} citizenView={false} />
              </div>
              {/* AI checkpoint callout or Stage 2 Scrutiny */}
              <div className="space-y-4">
                {project.currentStage === 2 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-blue-200/50 pb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1F3864]">Stage 2: Preliminary Scrutiny</h3>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Collector Scrutiny Console</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      Select and verify all submitted proposal documents to advance this project to **Stage 3 (Social Impact Assessment)**:
                    </p>

                    <div className="space-y-2 bg-white/80 p-3 rounded-lg border border-blue-100">
                      {[
                        { key: "dpr", label: "DPR (Detailed Project Report) submitted & verified" },
                        { key: "boundaries", label: "Boundary coordinates & land area matching" },
                        { key: "budget", label: "Acquisition budget clearance obtained" },
                        { key: "records", label: "Initial ownership records verified" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleCheck(item.key as any)}
                          className="flex items-start gap-2.5 text-left w-full hover:bg-blue-50/50 p-1 rounded transition-colors"
                        >
                          {scrutinyChecks[item.key as keyof typeof scrutinyChecks] ? (
                            <CheckSquare size={15} className="text-[#138808] mt-0.5 flex-shrink-0" />
                          ) : (
                            <Square size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-xs text-gray-700 font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleApproveScrutiny}
                        disabled={!allChecksPassed}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white transition-all ${
                          allChecksPassed ? "bg-[#138808] hover:bg-[#0E5F05] shadow-sm" : "bg-gray-300 cursor-not-allowed text-gray-500"
                        }`}
                      >
                        <ThumbsUp size={13} /> Approve Stage 2
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectModalOpen(true)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                      >
                        <ThumbsDown size={13} /> Send Back
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">AI</span>
                      </div>
                      <p className="text-sm font-semibold text-purple-800">Stage 8 — AI Valuation Check</p>
                    </div>
                    <p className="text-xs text-purple-700 leading-relaxed mb-3">
                      The AI anomaly detection module screens all declared compensation values against comparable market transactions and circle rates before the award is finalised.
                    </p>
                    {project.parcels.some((p) => p.flagged) ? (
                      <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <AlertTriangle size={13} className="text-red-500" />
                        <p className="text-xs text-red-700 font-medium">
                          {project.parcels.filter((p) => p.flagged).length} parcels flagged for manual review
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <CheckCircle size={13} className="text-green-600" />
                        <p className="text-xs text-green-700 font-medium">All parcels within expected value range</p>
                      </div>
                    )}
                    <Link href="/valuation-review" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:underline">
                      Open Valuation Review →
                    </Link>
                  </div>
                )}

                {/* Possession progress */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
                  <p className="text-sm font-semibold text-[#1F3864] mb-3">Possession Progress</p>
                  <div className="space-y-3">
                    {[
                      { label: "Acquisition", value: acquisitionPct, color: "#1F3864" },
                      { label: "Compensation", value: compensationPct, color: "#138808" },
                      { label: "Possession", value: project.possessionPercent, color: "#0369A1" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-semibold text-gray-800">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[#1F3864]">Case Documents</h2>
                <button
                  onClick={() => addToast("info", "Document upload interface opens in production")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#1F3864] text-[#1F3864] rounded-xl hover:bg-[#EAF0F8] transition-colors"
                >
                  <FileText size={12} /> Upload Document
                </button>
              </div>
              <DocumentList documents={project.documents} />
            </div>
          )}

          {activeTab === "parcels" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[#1F3864]">Land Parcels</h2>
                <span className="text-xs text-gray-400 italic">Illustrative sample data</span>
              </div>
              {project.parcels.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Parcel data will be available after the survey stage is completed.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" aria-label="Land parcels">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Parcel ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Land Type</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Area</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Declared Value</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Status</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500">Anomaly</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.parcels.map((parcel) => (
                        <tr key={parcel.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-3 py-2.5 font-mono text-[#1F3864]">{parcel.id}</td>
                          <td className="px-3 py-2.5 text-gray-600">{parcel.landType}</td>
                          <td className="px-3 py-2.5 text-gray-600">{parcel.area.toLocaleString("en-IN")} sq m</td>
                          <td className="px-3 py-2.5 font-medium text-gray-800">{formatCurrency(parcel.declaredValue, "lakh")}</td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              parcel.status === "compensated" ? "bg-green-100 text-green-700" :
                              parcel.status === "acquired" ? "bg-blue-100 text-blue-700" :
                              parcel.status === "disputed" ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {parcel.status}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            {parcel.flagged ? (
                              <span className="flex items-center gap-1 text-red-600 font-semibold">
                                <AlertTriangle size={11} /> {parcel.anomalyScore}/100
                              </span>
                            ) : (
                              <span className="text-green-600">{parcel.anomalyScore}/100</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-gray-400 italic text-center pb-4">
            Prototype data — all values are illustrative. Replace with verified DoLR data in production.
          </p>
        </main>
      </div>

      {/* Map Modal */}
      <Modal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        title={`Project Map — ${project.name}`}
        size="xl"
        footer={
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 italic">Schematic representation · Illustrative sample data</p>
            <button onClick={() => setMapModalOpen(false)} className="px-4 py-2 bg-[#1F3864] text-white rounded-xl text-sm font-medium">
              Close
            </button>
          </div>
        }
      >
        <div className="bg-[#EAF0F8] rounded-xl p-6 text-center">
          <div className="w-full aspect-video bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-3">
            <Map size={40} className="text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">Project Corridor Map</p>
            <p className="text-xs text-gray-400 max-w-xs text-center">
              GIS-enabled project map with parcel markers, acquired zones (green), pending zones (amber), and disputed zones (red) would display here in production.
            </p>
            <div className="flex gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />Acquired</div>
              <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />Pending</div>
              <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />Disputed</div>
            </div>
            <p className="text-[10px] text-gray-400 italic mt-2">Production: Bhuvan / DILRMP / PostGIS integration</p>
          </div>
        </div>
      </Modal>

      {/* Send Back Objections Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Send Back Proposal with Objections"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectScrutiny}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Confirm Objections
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-800">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Objection Action Summary</p>
              <p className="text-[11px] text-red-700 leading-relaxed mt-0.5">
                This proposal will be sent back to the Project Implementing Agency (PIA). The stage status will revert to Stage 1, and the requiring body will need to address the objections before resubmitting.
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="rejection-note-input" className="block text-xs font-bold text-gray-700">
              Objection / Deficiencies Note
            </label>
            <textarea
              id="rejection-note-input"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Detail the inconsistencies, missing documents, or budget issues..."
              className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
        </div>
      </Modal>

      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </ProtectedRoute>
  );
}
