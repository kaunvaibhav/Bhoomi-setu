"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText, Search, Filter, Download, Upload, Eye, CheckCircle,
  Shield, LogOut, RefreshCw, AlertCircle, Plus,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Modal from "@/components/Modal";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import {
  ALL_SYSTEM_DOCUMENTS,
  Document,
  UserRole,
  DEMO_ROLES,
} from "@/lib/mockData";

export default function DashboardDocumentsPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const [documents, setDocuments] = useState<Document[]>(ALL_SYSTEM_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState("SIA");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("success", "Digital Document Vault synchronized with State Gazettes");
    }, 600);
  };

  const handleDownload = (docName: string) => {
    addToast("info", `Downloading official copy: "${docName}" (Signed PDF)`);
  };

  const handleUploadNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) {
      addToast("error", "Please provide a document title");
      return;
    }

    const doc: Document = {
      id: `DOC-0${documents.length + 1}`,
      name: newDocName,
      type: newDocType,
      version: "v1.0",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      uploaderRole: roleConfig.label,
      size: "2.4 MB",
      url: "#",
    };

    setDocuments([doc, ...documents]);
    setUploadModalOpen(false);
    setNewDocName("");
    addToast("success", `Document "${doc.name}" securely uploaded and e-Stamped.`);
  };

  const filtered = documents.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.uploaderRole.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = filterType === "all" || d.type.toLowerCase().includes(filterType.toLowerCase());

    return matchSearch && matchType;
  });

  return (
    <ProtectedRoute>
      <TopUtilityBar />
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-[#1F3864] font-bold text-lg">BhoomiSetu</Link>
              <span className="text-gray-300">/</span>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-[#1F3864]">Dashboard</Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-semibold text-[#1F3864]">Digital Records Vault</span>
            </div>

            
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="flex">
          <div className="hidden lg:block">
            <DashboardSidebar currentRole={role} />
          </div>

          <main id="main-content" className="flex-1 min-w-0 p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1F3864] flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">Central Documents & Gazette Vault</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Cryptographically e-Signed statutory notifications, declarations, survey sheets & award decrees
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                  Refresh
                </button>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1F3864] text-white rounded-xl text-xs font-semibold hover:bg-[#2A4A8A] transition-colors shadow-xs"
                >
                  <Upload size={14} />
                  Upload Document
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Total Registered Files</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">{documents.length}</p>
                <p className="text-[10px] text-green-600 font-semibold mt-0.5">100% SHA-256 Stamped</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Gazette Notifications</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">
                  {documents.filter((d) => d.type.toLowerCase().includes("section") || d.type.toLowerCase().includes("gazette")).length}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Sec 11 & Sec 19</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">SIA & Survey Files</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">
                  {documents.filter((d) => d.type.toLowerCase().includes("sia") || d.type.toLowerCase().includes("survey")).length}
                </p>
                <p className="text-[10px] text-blue-600 mt-0.5">Field & Census Data</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Awards & Possession</p>
                <p className="text-xl font-bold text-[#138808] mt-1">
                  {documents.filter((d) => d.type.toLowerCase().includes("award") || d.type.toLowerCase().includes("possession")).length}
                </p>
                <p className="text-[10px] text-green-700 mt-0.5">Finalised Handover</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search documents by title, ID, or uploader authority..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All Document Types</option>
                  <option value="sia">Social Impact Assessment (SIA)</option>
                  <option value="section 11">Section 11 Gazette</option>
                  <option value="section 19">Section 19 Declaration</option>
                  <option value="objection">Objections & Hearings</option>
                  <option value="survey">GIS Surveys & Measurements</option>
                  <option value="award">Award Decrees</option>
                  <option value="r&r">R&R Scheme Plans</option>
                  <option value="possession">Possession Certificates</option>
                </select>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 pl-4">Document Title</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Version</th>
                      <th className="p-3.5">Published Date</th>
                      <th className="p-3.5">Authority / Role</th>
                      <th className="p-3.5">File Size</th>
                      <th className="p-3.5">Signature</th>
                      <th className="p-3.5 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((doc) => (
                      <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3.5 pl-4">
                          <span className="font-bold text-[#1F3864] block text-xs">{doc.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{doc.id}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-[#EAF0F8] text-[#1F3864] rounded-md font-semibold text-[10px]">
                            {doc.type}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-gray-600">{doc.version}</td>
                        <td className="p-3.5 text-gray-600">{doc.date}</td>
                        <td className="p-3.5 font-medium text-gray-700">{doc.uploaderRole}</td>
                        <td className="p-3.5 text-gray-500 font-mono text-[11px]">{doc.size}</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 text-green-700 font-bold text-[10px]">
                            <Shield size={12} /> e-Signed
                          </span>
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="p-1.5 text-gray-600 hover:text-[#1F3864] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Inspect document"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleDownload(doc.name)}
                              className="p-1.5 text-[#1F3864] hover:bg-[#EAF0F8] rounded-lg transition-colors"
                              title="Download signed PDF"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* Document Preview Modal */}
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Inspector — ${previewDoc?.name}`}
          size="lg"
        >
          {previewDoc && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 font-serif">
                <div className="text-center border-b border-gray-300 pb-3 font-sans">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    GOVERNMENT OF INDIA · DIGITAL REVENUE ARCHIVE
                  </p>
                  <p className="text-sm font-bold text-[#1F3864] mt-0.5">{previewDoc.name}</p>
                  <p className="text-[10px] text-gray-500">
                    Doc ID: {previewDoc.id} · Category: {previewDoc.type} · Registered on {previewDoc.date}
                  </p>
                </div>

                <div className="space-y-2 text-gray-700 leading-relaxed font-sans text-xs">
                  <p>
                    <strong>Statutory Authority:</strong> {previewDoc.uploaderRole}
                  </p>
                  <p>
                    This is a certified digital copy generated under Section 11 / Section 19 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR).
                  </p>
                  <p className="text-gray-500 italic text-[11px]">
                    All boundaries, land schedules, and solatium calculations referenced within this document have been cross-verified with the Survey of India spatial grid and registered circle rates.
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-300 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-1.5 text-green-700 font-bold text-xs">
                    <Shield size={15} />
                    <span>Cryptographic e-Sign Verified (NIC Certifying Authority)</span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-400">SHA256:7a9f...3e21</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-3.5 py-2 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewDoc.name);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 bg-[#1F3864] text-white rounded-xl font-bold hover:bg-[#2A4A8A] flex items-center gap-1.5"
                >
                  <Download size={13} />
                  Download Verified PDF
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Upload Modal */}
        <Modal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          title="Upload & e-Stamp Statutory Document"
          size="md"
        >
          <form onSubmit={handleUploadNew} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Document Title
              </label>
              <input
                type="text"
                placeholder="e.g., Section 11 Gazette Notification - District Varanasi"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Document Classification
              </label>
              <select
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
              >
                <option value="SIA">Social Impact Assessment Report</option>
                <option value="Section 11">Section 11 Gazette Notification</option>
                <option value="Section 19">Section 19 Final Declaration</option>
                <option value="Objection Register">Objection Hearing Record</option>
                <option value="GIS Survey">Geospatial Survey Sheet</option>
                <option value="Award Statement">Award Statement & Solatium Ledger</option>
                <option value="R&R Plan">Rehabilitation & Resettlement Plan</option>
                <option value="Possession Certificate">Physical Possession Handover</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Select File (PDF / GeoTIFF / KML)
              </label>
              <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                <p className="text-xs font-semibold text-[#1F3864]">Click or drag PDF to upload</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Maximum size: 25 MB</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-3.5 py-2 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1F3864] text-white rounded-xl font-bold hover:bg-[#2A4A8A]"
              >
                Submit & e-Sign
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
