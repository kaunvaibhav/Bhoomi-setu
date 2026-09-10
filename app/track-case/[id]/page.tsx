"use client";
import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Download, MessageSquarePlus, Phone, Home,
  AlertCircle, CheckCircle, Clock, Info, FileText, Upload
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";
import CaseTimeline from "@/components/CaseTimeline";
import DocumentList from "@/components/DocumentList";
import Modal from "@/components/Modal";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { CITIZEN_CASE, SAMPLE_PROJECTS } from "@/lib/mockData";
import { generateStageProgress } from "@/lib/workflowStages";
import { formatCurrency, getStageName } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CitizenCaseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { toasts, addToast, dismissToast } = useToast();

  const [objectionModalOpen, setObjectionModalOpen] = useState(false);
  const [grievanceModalOpen, setGrievanceModalOpen] = useState(false);
  
  const [objectionText, setObjectionText] = useState("");
  const [objectionFile, setObjectionFile] = useState(false);

  const [grievanceText, setGrievanceText] = useState("");

  const handleSubmitObjection = () => {
    if (!objectionText.trim()) {
      addToast("error", "Please enter objection details.");
      return;
    }
    setObjectionModalOpen(false);
    setObjectionText("");
    setObjectionFile(false);
    addToast("success", `Objection logged. Reference: OBJ-${Date.now().toString().slice(-4)}. Registered in case file.`);
  };

  const handleSubmitGrievance = () => {
    if (!grievanceText.trim()) {
      addToast("error", "Please enter grievance details.");
      return;
    }
    setGrievanceModalOpen(false);
    setGrievanceText("");
    addToast("success", `Grievance registered. Ticket Ref: GRV-${Date.now().toString().slice(-4)}.`);
  };

  // Only handle the sample case in prototype
  if (id !== "BS-UP-2026-004821") {
    return (
      <>
        <TopUtilityBar />
        <MainNavbar />
        <main id="main-content" className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 bg-[#EAF0F8]">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-card text-center max-w-md w-full flex flex-col items-center gap-3">
            <AlertCircle size={44} className="text-amber-500" />
            <h1 className="text-xl font-bold text-[#1F3864]">Case Not Found</h1>
            <p className="text-sm text-gray-500">
              The case ID <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs font-semibold">{id}</code> was not found in this prototype demonstration.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 w-full">
              <Link
                href="/track-case"
                className="flex-1 py-2.5 px-4 bg-[#1F3864] text-white rounded-xl text-sm font-medium hover:bg-[#2A4A8A] transition-colors text-center"
              >
                ← Search Again
              </Link>
              <Link
                href="/track-case/BS-UP-2026-004821"
                className="flex-1 py-2.5 px-4 bg-amber-100 text-amber-900 rounded-xl text-sm font-medium hover:bg-amber-200 transition-colors text-center"
              >
                Demo Case →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const caseData = CITIZEN_CASE;
  const project = SAMPLE_PROJECTS.find((p) => p.state === "Uttar Pradesh");
  const stageProgresses = generateStageProgress(caseData.currentStage, "in-progress");

  // Get documents available for this case (subset, publicly visible)
  const publicDocuments = project?.documents.slice(0, 3) ?? [];

  return (
    <>
      <TopUtilityBar />
      <MainNavbar />
      <main id="main-content" className="bg-[#EAF0F8] min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Back */}
          <Link href="/track-case" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1F3864] transition-colors">
            <ArrowLeft size={15} /> Back to Search
          </Link>

          {/* Case header card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Case ID</span>
                  <span className="font-mono text-xs font-bold text-[#1F3864]">{caseData.id}</span>
                </div>
                <h1 className="text-xl font-bold text-[#1F3864] mb-0.5">{caseData.project}</h1>
                <p className="text-sm text-gray-500">{caseData.village}, {caseData.district}, {caseData.state}</p>
              </div>
              <div className="flex-shrink-0 bg-[#EAF0F8] px-3 py-2 rounded-xl text-right">
                <p className="text-[10px] text-gray-500 mb-0.5">Current Stage</p>
                <p className="text-sm font-bold text-[#1F3864]">{caseData.currentStage}/12</p>
                <p className="text-[10px] text-gray-500">{getStageName(caseData.currentStage)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Land Owner", value: caseData.ownerName },
                { label: "Parcel ID", value: caseData.parcelId },
                { label: "Last Updated", value: caseData.lastUpdated },
                { label: "Assigned Office", value: caseData.assignedOffice },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-gray-500 mb-0.5">{item.label}</p>
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Next action */}
            <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <Clock size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-800">Expected Next Action</p>
                <p className="text-xs text-blue-700 mt-0.5">{caseData.expectedNextAction}</p>
              </div>
            </div>
          </div>

          {/* Compensation card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <h2 className="text-sm font-semibold text-[#1F3864] mb-4 flex items-center gap-2">
              <span className="text-lg">₹</span> Compensation Status
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center bg-[#EAF0F8] rounded-xl px-3 py-3">
                <p className="text-[10px] text-gray-500 mb-1">Assessed Amount</p>
                <p className="text-base font-bold text-[#1F3864]">{formatCurrency(caseData.compensationAssessed, "lakh")}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl px-3 py-3">
                <p className="text-[10px] text-gray-500 mb-1">Disbursed Amount</p>
                <p className="text-base font-bold text-gray-500">₹0</p>
              </div>
              <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-3">
                <p className="text-[10px] text-amber-700 mb-1">Status</p>
                <p className="text-xs font-bold text-amber-800">{caseData.compensationStatus}</p>
              </div>
            </div>

            {/* AI review note (citizen-friendly) */}
            {caseData.hasAiReview && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-800 mb-0.5">Additional Valuation Review Requested</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Your compensation assessment is undergoing an additional verification step. This review is intended to improve accuracy and does not itself change your legal entitlement.
                  </p>
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-400 italic mt-3">
              Illustrative sample data for prototype demonstration. Compensation values are not real government figures.
            </p>
          </div>

          {/* 12-Stage Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <h2 className="text-sm font-semibold text-[#1F3864] mb-4">Your Case Progress</h2>
            <CaseTimeline stages={stageProgresses} citizenView={true} />
          </div>

          {/* Available documents */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <h2 className="text-sm font-semibold text-[#1F3864] mb-3 flex items-center gap-2">
              <FileText size={15} />
              Available Documents
            </h2>
            <DocumentList documents={publicDocuments} compact={false} />
            <p className="text-[10px] text-gray-400 italic mt-2">
              Only documents relevant to your case and available for public access are shown here.
            </p>
          </div>

          {/* Citizen actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <h2 className="text-sm font-semibold text-[#1F3864] mb-4">Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { 
                  icon: <Download size={16} />, 
                  label: "Download Documents", 
                  color: "#1F3864",
                  onClick: () => addToast("info", "Starting package download for case documents...")
                },
                { 
                  icon: <MessageSquarePlus size={16} />, 
                  label: "Submit Objection", 
                  color: "#B45309",
                  onClick: () => setObjectionModalOpen(true)
                },
                { 
                  icon: <MessageSquarePlus size={16} />, 
                  label: "File Grievance", 
                  color: "#DC2626",
                  onClick: () => setGrievanceModalOpen(true)
                },
                { 
                  icon: <Phone size={16} />, 
                  label: "Contact Office", 
                  color: "#138808",
                  onClick: () => addToast("info", "District Acquisition Cell (Varanasi): +91 542 2250123")
                },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-2 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700 w-full"
                  aria-label={action.label}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: action.color }}
                  >
                    {action.icon}
                  </div>
                  {action.label}
                </button>
              ))}
            </div>

            {/* R&R info */}
            <div className="mt-4 bg-[#EAF7EE] border border-[#138808]/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Home size={14} className="text-[#138808]" />
                <p className="text-xs font-semibold text-[#138808]">Rehabilitation & Resettlement</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                R&R entitlements including housing support, livelihood assistance, and other benefits will be processed after possession. Your R&R case officer will contact you with next steps.
              </p>
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-400 italic pb-6">
            Prototype for Smart India Hackathon 2026 · All case data shown is illustrative sample data.
          </p>
        </div>
      </main>

      {/* Citizen Objection Modal */}
      <Modal
        isOpen={objectionModalOpen}
        onClose={() => setObjectionModalOpen(false)}
        title="Submit Legal Objection (Section 11/15)"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setObjectionModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitObjection}
              className="px-4 py-2 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Submit Objection
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            Pursuant to Section 15 of the RFCTLARR Act 2013, you may submit your objections regarding the area of land notified, the boundary suitability, or related measurements.
          </p>
          <div className="space-y-1">
            <label htmlFor="objection-text-input" className="block text-xs font-bold text-gray-700">
              Objection Details
            </label>
            <textarea
              id="objection-text-input"
              rows={4}
              value={objectionText}
              onChange={(e) => setObjectionText(e.target.value)}
              placeholder="State the reasons for your objection in detail..."
              className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Supporting Documents (Optional)</label>
            <div className="border border-dashed border-amber-200 rounded-lg p-3 bg-amber-50/20 text-center hover:bg-amber-50/50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={() => {
                  setObjectionFile(true);
                  addToast("success", "Objection support document uploaded.");
                }} 
              />
              <p className="text-xs text-[#B45309] font-semibold flex items-center justify-center gap-1.5">
                <Upload size={14} /> {objectionFile ? "✓ Document uploaded" : "Upload sale deed / layout correction maps"}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Citizen Grievance Modal */}
      <Modal
        isOpen={grievanceModalOpen}
        onClose={() => setGrievanceModalOpen(false)}
        title="File a Grievance"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setGrievanceModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitGrievance}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Register Grievance
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            Register any generic grievance or issue relating to process delays, R&R facilitation, or digital system access.
          </p>
          <div className="space-y-1">
            <label htmlFor="grievance-text-input" className="block text-xs font-bold text-gray-700">
              Grievance Details
            </label>
            <textarea
              id="grievance-text-input"
              rows={4}
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              placeholder="Describe your grievance or complaint in detail..."
              className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
        </div>
      </Modal>

      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
      <Footer />
    </>
  );
}
