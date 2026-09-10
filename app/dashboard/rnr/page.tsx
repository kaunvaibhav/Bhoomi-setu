"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, Home, Briefcase, Award, CheckCircle, Clock,
  AlertTriangle, Search, Filter, Download, Plus, LogOut,
  RefreshCw, Eye, MessageSquare,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Modal from "@/components/Modal";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import {
  SAMPLE_RNR_BENEFICIARIES,
  RnrBeneficiary,
  UserRole,
  DEMO_ROLES,
} from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export default function DashboardRnrPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const [beneficiaries, setBeneficiaries] = useState<RnrBeneficiary[]>(
    SAMPLE_RNR_BENEFICIARIES
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedFamily, setSelectedFamily] = useState<RnrBeneficiary | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("success", "R&R Census & Entitlement database synchronized");
    }, 600);
  };

  const handleResolveGrievance = (id: string) => {
    setBeneficiaries((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, grievanceCount: 0, status: "In Progress" as const }
          : b
      )
    );
    if (selectedFamily && selectedFamily.id === id) {
      setSelectedFamily((prev) =>
        prev ? { ...prev, grievanceCount: 0, status: "In Progress" } : null
      );
    }
    addToast("success", `Grievance for beneficiary ${id} marked as resolved by Collector Desk.`);
  };

  const filtered = beneficiaries.filter((b) => {
    const matchSearch =
      b.familyHead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.project.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCat = filterCategory === "all" || b.category === filterCategory;
    const matchStatus = filterStatus === "all" || b.status === filterStatus;

    return matchSearch && matchCat && matchStatus;
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
              <span className="text-sm font-semibold text-[#1F3864]">Rehabilitation & Resettlement</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-[#EAF0F8] px-3 py-1.5 rounded-xl border border-blue-200/60">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: roleConfig.color }}>
                  {user?.avatarInitials || roleConfig.label[0]}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-[#1F3864] block leading-tight">{user?.name || roleConfig.label}</span>
                  <span className="text-[9px] text-gray-500 block leading-tight">{user?.roleTitle || roleConfig.label}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
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
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">Rehabilitation & Resettlement (Stage 11)</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  RFCTLARR Act 2013 Chapter V family-wise welfare, alternate housing & subsistence entitlement tracking
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
                  onClick={() => addToast("info", "R&R census report exported (PDF/Excel)")}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <Download size={13} />
                  Export Census
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Mapped Displaced Families</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">{beneficiaries.length}</p>
                <p className="text-[10px] text-green-600 font-semibold mt-0.5">100% SIA Census Complete</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Housing Allotments</p>
                <p className="text-xl font-bold text-[#138808] mt-1">
                  {beneficiaries.filter((b) => b.entitlements.housingAllotment === "Allotted" || b.entitlements.housingAllotment === "Constructed").length}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Model Resettlement Colonies</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Subsistence Allowance</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">
                  {formatCurrency(
                    beneficiaries.reduce((acc, curr) => acc + curr.entitlements.subsistenceAmount, 0)
                  )}
                </p>
                <p className="text-[10px] text-blue-600 mt-0.5">Direct Bank Transfers</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Open Grievances</p>
                <p className="text-xl font-bold text-amber-600 mt-1">
                  {beneficiaries.reduce((acc, curr) => acc + curr.grievanceCount, 0)} Active
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">Under Collector Hearing</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by Family Head, R&R ID, Village, or Project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All Social Categories</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="OBC">OBC</option>
                  <option value="General">General</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All R&R Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Grievance Pending">Grievance Pending</option>
                  <option value="Verification Underway">Verification Underway</option>
                </select>
              </div>
            </div>

            {/* Beneficiaries Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 pl-4">Family Head & Aadhaar</th>
                      <th className="p-3.5">Category & Status</th>
                      <th className="p-3.5">Location & Project</th>
                      <th className="p-3.5">Housing Allotment</th>
                      <th className="p-3.5">Job / Cash Option</th>
                      <th className="p-3.5">Subsistence Grant</th>
                      <th className="p-3.5">R&R Progress</th>
                      <th className="p-3.5 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((b) => (
                      <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3.5 pl-4">
                          <span className="font-bold text-[#1F3864] block">{b.familyHead}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{b.id} · {b.aadhaarMasked}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded text-[10px] mr-1">
                            {b.category}
                          </span>
                          <span className="text-[11px] text-gray-500">{b.displacedStatus}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-800 block">{b.village}, {b.district}</span>
                          <span className="text-[10px] text-gray-500 truncate max-w-[140px] block">{b.project}</span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.entitlements.housingAllotment === "Allotted"
                                ? "bg-green-100 text-green-700"
                                : b.entitlements.housingAllotment === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {b.entitlements.housingAllotment}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-gray-700">
                          {b.entitlements.jobOrAnnuity}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-[#138808]">
                            ₹{b.entitlements.subsistenceAmount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-gray-400 block">{b.entitlements.subsistenceGrant}</span>
                        </td>
                        <td className="p-3.5">
                          {b.status === "Completed" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700">
                              <CheckCircle size={12} /> Settled
                            </span>
                          ) : b.status === "Grievance Pending" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                              <AlertTriangle size={12} /> Grievance Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600">
                              <Clock size={12} /> In Progress
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <button
                            onClick={() => setSelectedFamily(b)}
                            className="px-2.5 py-1.5 bg-[#EAF0F8] text-[#1F3864] hover:bg-[#1F3864] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* Beneficiary Details Modal */}
        <Modal
          isOpen={!!selectedFamily}
          onClose={() => setSelectedFamily(null)}
          title={`R&R Entitlement Dossier — ${selectedFamily?.id}`}
          size="md"
        >
          {selectedFamily && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#EAF0F8] border border-blue-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Head of Household</span>
                <p className="text-base font-bold text-[#1F3864]">{selectedFamily.familyHead}</p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  UID: {selectedFamily.aadhaarMasked} · Social Category: {selectedFamily.category} ({selectedFamily.displacedStatus})
                </p>
              </div>

              <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <p className="font-bold text-[#1F3864] text-xs">Statutory Entitlement Breakdown</p>
                <div className="flex justify-between">
                  <span className="text-gray-500">Resettlement Housing:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedFamily.entitlements.housingPlotNumber || selectedFamily.entitlements.housingAllotment}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Livelihood Option:</span>
                  <span className="font-semibold text-gray-800">{selectedFamily.entitlements.jobOrAnnuity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subsistence Grant (1 Year):</span>
                  <span className="font-bold text-[#138808]">₹{selectedFamily.entitlements.subsistenceAmount.toLocaleString("en-IN")} ({selectedFamily.entitlements.subsistenceGrant})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Resettlement Allowance:</span>
                  <span className="font-semibold text-gray-800">{selectedFamily.entitlements.resettlementAllowance}</span>
                </div>
              </div>

              {selectedFamily.grievanceCount > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <AlertTriangle size={14} />
                    <span>Active Grievance Filed by Beneficiary</span>
                  </div>
                  <p className="text-gray-600 text-[11px]">
                    Beneficiary submitted a request regarding location preference for the model resettlement plot.
                  </p>
                  <button
                    onClick={() => handleResolveGrievance(selectedFamily.id)}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors text-xs"
                  >
                    Resolve & Close Grievance Ticket
                  </button>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setSelectedFamily(null)}
                  className="px-4 py-2 bg-[#1F3864] text-white rounded-xl font-semibold hover:bg-[#2A4A8A]"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
