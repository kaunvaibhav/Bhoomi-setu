"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Upload, CheckCircle, ArrowRight, FileText,
  MapPin, Building2, ChevronRight,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import ToastNotification, { useToast } from "@/components/ToastNotification";

const WORKFLOW_PREVIEW = [
  "Submission",
  "Preliminary Scrutiny",
  "State Review",
  "District Processing",
  "SIA",
  "Section 11 Notification",
];

interface FormData {
  projectTitle: string;
  projectType: string;
  requiringBody: string;
  state: string;
  district: string;
  estimatedLand: string;
  description: string;
  proposedArea: string;
  parcels: string;
  landType: string;
  affectedFamilies: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const { toasts, addToast, dismissToast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");

  const [form, setForm] = useState<FormData>({
    projectTitle: "",
    projectType: "",
    requiringBody: "",
    state: "",
    district: "",
    estimatedLand: "",
    description: "",
    proposedArea: "",
    parcels: "",
    landType: "",
    affectedFamilies: "",
  });

  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleDocUpload(docName: string) {
    setUploadedDocs((prev) => new Set([...prev, docName]));
    addToast("success", `${docName} uploaded successfully (prototype)`);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRefId("BS-PROP-2026-00124");
    setSubmitting(false);
    setSubmitted(true);
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <TopUtilityBar />
        <main id="main-content" className="min-h-screen bg-[#EAF0F8] flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#EAF7EE] flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-[#138808]" />
            </div>
            <h1 className="text-xl font-bold text-[#1F3864] mb-2">Proposal Submitted Successfully</h1>
            <div className="bg-[#EAF0F8] rounded-xl px-4 py-3 my-4 text-left">
              <p className="text-xs text-gray-500 mb-1">Reference ID</p>
              <p className="text-base font-bold font-mono text-[#1F3864]">{refId}</p>
            </div>
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">
              Your proposal has been submitted for preliminary scrutiny by the District Authority.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-left">
              <p className="text-xs font-semibold text-blue-800 mb-0.5">Next Action</p>
              <p className="text-xs text-blue-700">Preliminary scrutiny by District Authority. You will be notified within 15 working days.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="flex-1 py-2.5 bg-[#1F3864] text-white rounded-xl text-sm font-semibold text-center hover:bg-[#2A4A8A] transition-colors">
                Go to Dashboard
              </Link>
              <button
                onClick={() => { setSubmitted(false); setStep(1); setForm({ projectTitle: "", projectType: "", requiringBody: "", state: "", district: "", estimatedLand: "", description: "", proposedArea: "", parcels: "", landType: "", affectedFamilies: "" }); setUploadedDocs(new Set()); }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const INPUT = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50";
  const SELECT = INPUT;
  const LABEL = "block text-xs font-semibold text-gray-700 mb-1.5";

  return (
    <>
      <TopUtilityBar />
      <div className="min-h-screen bg-[#EAF0F8]">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-[#1F3864] text-sm font-medium">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-medium text-[#1F3864]">Submit New Land Acquisition Proposal</span>
          </div>
        </div>

        <main id="main-content" className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1F3864]">Submit New Land Acquisition Proposal</h1>
            <p className="text-sm text-gray-500 mt-1">Complete all sections and upload required documents before submitting for scrutiny.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {["Project Info", "Land Requirement", "Documents", "Review"].map((label, i) => {
              const stepNum = i + 1;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step > stepNum ? "bg-[#138808] text-white" :
                        step === stepNum ? "bg-[#1F3864] text-white" :
                        "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step > stepNum ? <CheckCircle size={16} /> : stepNum}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">{label}</span>
                  </div>
                  {i < 3 && (
                    <div className="flex-1 h-0.5 mx-2 mt-[-1rem]" style={{ backgroundColor: step > stepNum ? "#138808" : "#E5E7EB" }} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Project Information */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
                  <h2 className="text-sm font-bold text-[#1F3864] mb-4">Project Information</h2>
                  <div>
                    <label htmlFor="proj-title" className={LABEL}>Project Title <span className="text-red-500">*</span></label>
                    <input id="proj-title" value={form.projectTitle} onChange={(e) => update("projectTitle", e.target.value)} placeholder="Enter full project name" className={INPUT} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="proj-type" className={LABEL}>Project Type <span className="text-red-500">*</span></label>
                      <select id="proj-type" value={form.projectType} onChange={(e) => update("projectType", e.target.value)} className={SELECT} required>
                        <option value="">Select type</option>
                        <option>Highway</option>
                        <option>Railway</option>
                        <option>Industrial Corridor</option>
                        <option>Irrigation</option>
                        <option>Renewable Energy</option>
                        <option>Urban Development</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="req-body" className={LABEL}>Requiring Body <span className="text-red-500">*</span></label>
                      <input id="req-body" value={form.requiringBody} onChange={(e) => update("requiringBody", e.target.value)} placeholder="e.g. NHAI, PGCIL" className={INPUT} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className={LABEL}>State <span className="text-red-500">*</span></label>
                      <select id="state" value={form.state} onChange={(e) => update("state", e.target.value)} className={SELECT} required>
                        <option value="">Select state</option>
                        <option>Uttar Pradesh</option>
                        <option>Rajasthan</option>
                        <option>Maharashtra</option>
                        <option>Karnataka</option>
                        <option>Madhya Pradesh</option>
                        <option>Gujarat</option>
                        <option>Tamil Nadu</option>
                        <option>Andhra Pradesh</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="district" className={LABEL}>District <span className="text-red-500">*</span></label>
                      <input id="district" value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="Enter district name" className={INPUT} required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="est-land" className={LABEL}>Estimated Land Requirement (Hectares) <span className="text-red-500">*</span></label>
                    <input id="est-land" type="number" value={form.estimatedLand} onChange={(e) => update("estimatedLand", e.target.value)} placeholder="e.g. 1200" className={INPUT} required />
                  </div>
                  <div>
                    <label htmlFor="description" className={LABEL}>Project Description</label>
                    <textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} placeholder="Brief description of the project and its public purpose..." className={INPUT + " resize-none"} />
                  </div>
                </div>
              )}

              {/* Step 2: Land Requirement */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
                  <h2 className="text-sm font-bold text-[#1F3864] mb-4">Land Requirement Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="prop-area" className={LABEL}>Proposed Acquisition Area (ha)</label>
                      <input id="prop-area" type="number" value={form.proposedArea} onChange={(e) => update("proposedArea", e.target.value)} placeholder="Hectares" className={INPUT} />
                    </div>
                    <div>
                      <label htmlFor="parcels" className={LABEL}>Estimated Number of Parcels</label>
                      <input id="parcels" type="number" value={form.parcels} onChange={(e) => update("parcels", e.target.value)} placeholder="Number of parcels" className={INPUT} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="land-type" className={LABEL}>Predominant Land Type</label>
                      <select id="land-type" value={form.landType} onChange={(e) => update("landType", e.target.value)} className={SELECT}>
                        <option value="">Select land type</option>
                        <option>Agricultural (Irrigated)</option>
                        <option>Agricultural (Rain-fed)</option>
                        <option>Forest Land</option>
                        <option>Urban / Residential</option>
                        <option>Industrial / Commercial</option>
                        <option>Wasteland / Arid</option>
                        <option>Mixed</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="families" className={LABEL}>Estimated Affected Families</label>
                      <input id="families" type="number" value={form.affectedFamilies} onChange={(e) => update("affectedFamilies", e.target.value)} placeholder="Number of families" className={INPUT} />
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Preliminary Map / Location Demarcation</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-2 bg-gray-50">
                      <MapPin size={28} className="text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">Map Upload / Draw-on-Map</p>
                      <p className="text-xs text-gray-400 text-center">In production: integrated GIS interface for boundary demarcation. Upload KML, GeoJSON, or use the drawing tool.</p>
                      <button type="button" className="mt-2 px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100">
                        Upload KML / Shapefile (Prototype)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {step === 3 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                  <h2 className="text-sm font-bold text-[#1F3864] mb-4">Required Documents</h2>
                  <div className="space-y-3">
                    {[
                      { name: "Detailed Project Report (DPR)", required: true },
                      { name: "Administrative Approval", required: true },
                      { name: "Preliminary Feasibility Report", required: true },
                      { name: "Land Requirement Statement", required: true },
                      { name: "Social Impact Assessment (if available)", required: false },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                          uploadedDocs.has(doc.name) ? "bg-[#EAF7EE] border-[#138808]/30" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText size={16} className={uploadedDocs.has(doc.name) ? "text-[#138808]" : "text-gray-400"} />
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{doc.name}</p>
                            <p className="text-[10px] text-gray-500">{doc.required ? "Required" : "Optional"}</p>
                          </div>
                        </div>
                        {uploadedDocs.has(doc.name) ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#138808]">
                            <CheckCircle size={12} /> Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDocUpload(doc.name)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1F3864] text-[#1F3864] rounded-xl text-[11px] font-semibold hover:bg-[#EAF0F8] transition-colors"
                          >
                            <Upload size={11} /> Upload
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 italic">
                    Prototype: file upload is simulated. In production, documents would be stored in the secure document repository.
                  </p>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
                  <h2 className="text-sm font-bold text-[#1F3864] mb-4">Review & Submit</h2>
                  <div className="space-y-2">
                    {[
                      ["Project Title", form.projectTitle || "(not entered)"],
                      ["Project Type", form.projectType || "(not selected)"],
                      ["Requiring Body", form.requiringBody || "(not entered)"],
                      ["State", form.state || "(not selected)"],
                      ["District", form.district || "(not entered)"],
                      ["Estimated Land", form.estimatedLand ? `${form.estimatedLand} ha` : "(not entered)"],
                      ["Affected Families", form.affectedFamilies || "(not entered)"],
                    ].map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-xs text-gray-500">{key}</span>
                        <span className="text-xs font-semibold text-gray-800">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-700 leading-relaxed">
                      By submitting, you confirm that all information provided is accurate to the best of your knowledge, and that the required documents have been uploaded.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-4">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : (
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                    <ArrowLeft size={14} /> Cancel
                  </Link>
                )}
                {step < 4 ? (
                  <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-5 py-2 bg-[#1F3864] text-white rounded-xl text-sm font-medium hover:bg-[#2A4A8A]">
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2 bg-[#138808] text-white rounded-xl text-sm font-semibold hover:bg-[#0F6606] disabled:opacity-60"
                  >
                    {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={14} />}
                    Submit Proposal for Scrutiny
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar: Workflow preview */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Workflow Preview</p>
                <div className="space-y-0">
                  {WORKFLOW_PREVIEW.map((stage, i) => (
                    <div key={stage} className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? "bg-[#1F3864] text-white" : "bg-gray-100 text-gray-500"}`}>
                          {i + 1}
                        </div>
                        {i < WORKFLOW_PREVIEW.length - 1 && <div className="w-0.5 h-5 bg-gray-200" />}
                      </div>
                      <p className={`text-xs ${i === 0 ? "font-semibold text-[#1F3864]" : "text-gray-500"}`}>{stage}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-[10px] text-purple-600">
                    <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                    AI valuation check occurs at Award Declaration stage
                  </div>
                </div>
              </div>

              <div className="bg-[#EAF0F8] rounded-xl p-4 text-xs text-gray-600 space-y-1.5">
                <p className="font-semibold text-[#1F3864] mb-2">Submission Checklist</p>
                {["Project title and type", "Requiring body details", "State and district", "Land estimate", "Required documents"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-[#138808]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
