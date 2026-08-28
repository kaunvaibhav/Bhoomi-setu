"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Brain, AlertTriangle, CheckCircle, BarChart2,
  Search, Filter, RefreshCw, Map, FileText, RotateCcw, Eye,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ValuationReviewCard from "@/components/ValuationReviewCard";
import Modal from "@/components/Modal";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { FLAGGED_PARCELS, VALUATION_KPIS, type UserRole } from "@/lib/mockData";
import { formatCurrency, getAnomalyColor } from "@/lib/utils";

export default function ValuationReviewPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewedParcels, setReviewedParcels] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const { toasts, addToast, dismissToast } = useToast();

  const selectedParcel = FLAGGED_PARCELS.find((p) => p.parcelId === selectedParcelId);

  const filtered = FLAGGED_PARCELS.filter((p) =>
    !searchQuery ||
    p.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleMarkReviewed() {
    if (!selectedParcelId) return;
    setReviewedParcels((prev) => new Set([...prev, selectedParcelId]));
    setReviewModalOpen(false);
    addToast("success", `Parcel ${selectedParcelId} marked as reviewed. Record logged.`);
  }

  function handleRequestReassessment() {
    if (!selectedParcelId) return;
    addToast("info", `Reassessment request submitted for ${selectedParcelId}. Reference will be generated.`);
  }

  function handleAddNote() {
    if (!reviewNote.trim()) return;
    addToast("success", "Review note saved to case record.");
    setReviewNote("");
  }

  const chartData = selectedParcel
    ? [
        { name: "Declared Value", value: selectedParcel.declaredValue / 100000, fill: "#DC2626" },
        { name: "Circle Rate", value: selectedParcel.circleRate / 100000, fill: "#B45309" },
        { name: "Expected Low", value: selectedParcel.expectedRangeLow / 100000, fill: "#059669" },
        { name: "Expected High", value: selectedParcel.expectedRangeHigh / 100000, fill: "#138808" },
      ]
    : [];

  return (
    <ProtectedRoute allowedRoles={["ministry", "district"]}>
      <TopUtilityBar />
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-[#1F3864] text-sm font-medium">
                <ArrowLeft size={16} /> Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Brain size={15} className="text-purple-600" /> Compensation Valuation Review
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-[#EAF0F8] px-3 py-1.5 rounded-xl border border-blue-200/60">
                <div className="w-5 h-5 rounded-full bg-[#1F3864] text-white text-[9px] font-bold flex items-center justify-center">
                  {user?.avatarInitials || "U"}
                </div>
                <span className="text-xs font-semibold text-[#1F3864]">{user?.name}</span>
              </div>
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

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar currentRole={role} />
          </div>

          <main id="main-content" className="flex-1 min-w-0 p-5 space-y-5">
            {/* Page header */}
            <div>
              <h1 className="text-xl font-bold text-[#1F3864]">Compensation Valuation Review</h1>
              <p className="text-xs text-gray-500 mt-0.5">Decision support for identifying unusual declared values before award finalisation.</p>
            </div>

            {/* AI disclaimer banner */}
            <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3" role="alert">
              <Brain size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-800 leading-relaxed">
                <strong>Important:</strong> The AI module only recommends manual review. It does not determine or override the legally payable compensation amount. Final decisions remain with the authorised Land Acquisition Officer.
              </p>
            </div>

            {/* KPI summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Awards Reviewed", value: VALUATION_KPIS.awardsReviewed.toString(), color: "#1F3864" },
                { label: "Flags Requiring Review", value: VALUATION_KPIS.flagsRequiringReview.toString(), color: "#DC2626" },
                { label: "Average Anomaly Score", value: `${VALUATION_KPIS.averageAnomalyScore} / 100`, color: "#B45309" },
                { label: "Low-Confidence Regions", value: VALUATION_KPIS.lowConfidenceRegions.toString(), color: "#7C3AED" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 shadow-card px-4 py-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="text-[9px] text-gray-400 italic mt-0.5">Illustrative sample</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Left: Review table / cards */}
              <div className="lg:col-span-2 space-y-3">
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-card">
                  <Search size={14} className="text-gray-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by parcel ID, project, or state..."
                    className="flex-1 text-xs bg-transparent outline-none text-gray-600 placeholder-gray-400"
                    aria-label="Search parcels"
                  />
                </div>

                <div className="space-y-3">
                  {filtered.map((parcel) => (
                    <ValuationReviewCard
                      key={parcel.parcelId}
                      parcel={parcel}
                      onSelect={setSelectedParcelId}
                      isSelected={selectedParcelId === parcel.parcelId}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">No parcels match your search.</div>
                  )}
                </div>
              </div>

              {/* Right: Detail panel */}
              <div className="lg:col-span-3">
                {selectedParcel ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-5 sticky top-20">
                    {/* Parcel header */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-[#1F3864] font-mono">{selectedParcel.parcelId}</h2>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-bold text-white"
                          style={{ backgroundColor: getAnomalyColor(selectedParcel.anomalyScore) }}
                        >
                          Score: {selectedParcel.anomalyScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{selectedParcel.project} · {selectedParcel.state} · {selectedParcel.landType}</p>
                    </div>

                    {/* AI output */}
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain size={15} className="text-purple-600" />
                        <p className="text-xs font-bold text-purple-800">AI Module Output</p>
                        <span className="text-[9px] px-1.5 py-0.5 bg-purple-200 rounded text-purple-800 font-semibold">RECOMMEND MANUAL REVIEW</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-purple-700">
                        <p><strong>Anomaly score:</strong> {selectedParcel.anomalyScore} / 100</p>
                        <p><strong>Expected fair-value range:</strong> {formatCurrency(selectedParcel.expectedRangeLow)} – {formatCurrency(selectedParcel.expectedRangeHigh)}</p>
                        <p><strong>Declared value:</strong> {formatCurrency(selectedParcel.declaredValue)}</p>
                      </div>
                      <div className="mt-3 p-2.5 bg-purple-100 rounded-lg">
                        <p className="text-xs text-purple-800 leading-relaxed">
                          Declared value is approximately{" "}
                          {selectedParcel.declaredValue < selectedParcel.expectedRangeLow
                            ? `${Math.round(((selectedParcel.expectedRangeLow - selectedParcel.declaredValue) / selectedParcel.expectedRangeLow) * 100)}% below`
                            : `${Math.round(((selectedParcel.declaredValue - selectedParcel.expectedRangeHigh) / selectedParcel.expectedRangeHigh) * 100)}% above`}{" "}
                          {selectedParcel.comparables} comparable transactions within {selectedParcel.searchRadius} km during the last {selectedParcel.lookbackMonths} months.
                        </p>
                      </div>
                    </div>

                    {/* Evidence */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Evidence Inputs</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Comparable transactions", value: selectedParcel.comparables.toString() },
                          { label: "Search radius", value: `${selectedParcel.searchRadius} km` },
                          { label: "Lookback window", value: `${selectedParcel.lookbackMonths} months` },
                          { label: "Circle rate", value: formatCurrency(selectedParcel.circleRate, "lakh") },
                          { label: "Distance to highway", value: `${selectedParcel.distToHighway} km` },
                          { label: "Infra announcement", value: selectedParcel.infraAnnouncement ? "Detected" : "None" },
                        ].map((ev) => (
                          <div key={ev.label} className="bg-gray-50 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-gray-500 mb-0.5">{ev.label}</p>
                            <p className="text-xs font-semibold text-gray-800">{ev.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Value chart */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Value Comparison (₹ Lakh)</p>
                      <p className="text-[10px] text-gray-400 italic mb-2">Illustrative sample data</p>
                      <ResponsiveContainer width="100%" height={140}>
                        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                          <XAxis type="number" tick={{ fontSize: 10 }} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={85} />
                          <Tooltip formatter={(v) => typeof v === "number" ? `₹${v.toFixed(2)}L` : v} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, i) => (
                              <Cell key={i} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Review note */}
                    <div>
                      <label htmlFor="review-note" className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Add Review Note
                      </label>
                      <textarea
                        id="review-note"
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        rows={2}
                        placeholder="Enter your review observations..."
                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1F3864] bg-gray-50 resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setReviewModalOpen(true)}
                        disabled={reviewedParcels.has(selectedParcel.parcelId)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#138808] text-white rounded-xl text-xs font-semibold hover:bg-[#0F6606] transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={13} />
                        {reviewedParcels.has(selectedParcel.parcelId) ? "Reviewed" : "Mark as Reviewed"}
                      </button>
                      <button
                        onClick={handleRequestReassessment}
                        className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold hover:bg-amber-200 transition-colors border border-amber-300"
                      >
                        <RotateCcw size={13} />
                        Request Reassessment
                      </button>
                      <button
                        onClick={handleAddNote}
                        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <FileText size={13} />
                        Save Note
                      </button>
                      <button
                        onClick={() => addToast("info", "Parcel map view would open in production")}
                        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <Map size={13} />
                        Open on Map
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 flex flex-col items-center justify-center gap-3 text-center h-64">
                    <Brain size={32} className="text-gray-200" />
                    <p className="text-sm font-semibold text-gray-400">Select a flagged parcel to view AI analysis</p>
                    <p className="text-xs text-gray-400">Choose any parcel from the list on the left to view the detailed anomaly breakdown, comparable transactions, and officer action options.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mark as reviewed confirmation modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Confirm Review Action"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setReviewModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleMarkReviewed} className="px-4 py-2 bg-[#138808] text-white rounded-xl text-sm font-medium hover:bg-[#0F6606]">
              Confirm Review
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              This action records that the officer reviewed the AI recommendation. It does not approve or alter the compensation amount.
            </p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Marking this parcel as reviewed creates an auditable record indicating that the AI anomaly flag was examined by an authorised officer. The legal compensation amount remains subject to the award process under the RFCTLARR Act, 2013.
          </p>
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
            <p><strong>Parcel ID:</strong> {selectedParcel?.parcelId}</p>
            <p><strong>Anomaly score:</strong> {selectedParcel?.anomalyScore}/100</p>
            <p><strong>Action:</strong> Mark as reviewed (AI recommendation acknowledged)</p>
          </div>
        </div>
      </Modal>

      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </ProtectedRoute>
  );
}
