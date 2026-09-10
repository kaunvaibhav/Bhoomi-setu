"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign, Search, Filter, Download, ArrowRight, CheckCircle,
  Clock, AlertCircle, RefreshCw, Send, ShieldCheck, FileText,
  LogOut, Layers,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Modal from "@/components/Modal";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import {
  SAMPLE_COMPENSATION_TRANSACTIONS,
  CompensationTransaction,
  UserRole,
  DEMO_ROLES,
} from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export default function DashboardCompensationPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const [transactions, setTransactions] = useState<CompensationTransaction[]>(
    SAMPLE_COMPENSATION_TRANSACTIONS
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTxn, setSelectedTxn] = useState<CompensationTransaction | null>(null);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("success", "PFMS DBT Gateway sync completed (Response: HTTP 200 OK)");
    }, 600);
  };

  const handleDisburseSingle = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "disbursed" as const,
              disbursedAmount: t.totalPayable,
              disbursedDate: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              pfmsResponseCode: "SUCCESS_00",
            }
          : t
      )
    );
    addToast(
      "success",
      `PFMS Direct Benefit Transfer of ₹${selectedTxn?.totalPayable.toLocaleString(
        "en-IN"
      )} authorized and credited to bank account.`
    );
    setSelectedTxn(null);
  };

  const handleBatchRelease = () => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.status === "approved"
          ? {
              ...t,
              status: "disbursed" as const,
              disbursedAmount: t.totalPayable,
              disbursedDate: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              pfmsResponseCode: "SUCCESS_00",
            }
          : t
      )
    );
    setBatchModalOpen(false);
    addToast("success", "Batch PFMS-DBT payout instruction dispatched to Reserve Bank of India / PFMS switch.");
  };

  const filteredTxns = transactions.filter((t) => {
    const matchSearch =
      t.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.pfmsTxnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      filterStatus === "all" ? true : t.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const totalAssessed = transactions.reduce((acc, curr) => acc + curr.assessedAmount, 0);
  const totalPayable = transactions.reduce((acc, curr) => acc + curr.totalPayable, 0);
  const totalDisbursed = transactions.reduce((acc, curr) => acc + curr.disbursedAmount, 0);
  const pendingCount = transactions.filter((t) => t.status !== "disbursed").length;

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
              <span className="text-sm font-semibold text-[#1F3864]">Compensation & PFMS-DBT</span>
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
                  <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                    <DollarSign size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">Compensation Disbursement (Stage 9)</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PFMS (Public Financial Management System) Direct Benefit Transfer ledger & solatium calculator
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                  Sync PFMS
                </button>
                <button
                  onClick={() => addToast("info", "Compensation ledger CSV exported successfully")}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <Download size={13} />
                  Export Ledger
                </button>
                <button
                  onClick={() => setBatchModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#138808] text-white rounded-xl text-xs font-semibold hover:bg-[#0E5F05] transition-colors shadow-xs"
                >
                  <Send size={14} />
                  Batch PFMS Release
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Total Assessed Value</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">{formatCurrency(totalAssessed)}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Base Land Valuation</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Total Payable (+ Solatium)</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">{formatCurrency(totalPayable)}</p>
                <p className="text-[10px] text-blue-600 mt-0.5">Incl. 100% Solatium & Int.</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Total Disbursed (PFMS)</p>
                <p className="text-xl font-bold text-[#138808] mt-1">{formatCurrency(totalDisbursed)}</p>
                <p className="text-[10px] text-green-700 font-semibold mt-0.5">
                  {((totalDisbursed / totalPayable) * 100).toFixed(1)}% Disbursed
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Pending Payouts</p>
                <p className="text-xl font-bold text-amber-600 mt-1">{pendingCount} Beneficiaries</p>
                <p className="text-[10px] text-amber-600 mt-0.5">Awaiting release / verification</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by Beneficiary Name, PFMS Txn ID, Parcel ID, or Project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All Disbursement Statuses</option>
                  <option value="disbursed">Disbursed (PFMS Confirmed)</option>
                  <option value="approved">Approved for Release</option>
                  <option value="bank-processing">Bank Processing</option>
                  <option value="pending-review">Pending Valuation Review</option>
                </select>
              </div>
            </div>

            {/* Compensation Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 pl-4">Beneficiary & Aadhaar</th>
                      <th className="p-3.5">PFMS Txn ID</th>
                      <th className="p-3.5">Parcel & Project</th>
                      <th className="p-3.5">Assessed + Solatium</th>
                      <th className="p-3.5">Total Payable</th>
                      <th className="p-3.5">Bank Details</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTxns.map((t) => (
                      <tr key={t.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3.5 pl-4">
                          <span className="font-bold text-[#1F3864] block">{t.beneficiaryName}</span>
                          <span className="text-[10px] text-gray-400 font-mono">UID: {t.aadhaarMasked}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono text-gray-700 text-[11px] block">{t.pfmsTxnId}</span>
                          <span className="text-[9.5px] text-gray-400">{t.paymentMode}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-800 block">{t.parcelId}</span>
                          <span className="text-[10px] text-gray-500 truncate max-w-[150px] block">{t.project}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-gray-700 block">{formatCurrency(t.assessedAmount)}</span>
                          <span className="text-[10px] text-gray-400">+ {formatCurrency(t.solatiumAmount)} (Solatium)</span>
                        </td>
                        <td className="p-3.5 font-bold text-[#138808]">
                          {formatCurrency(t.totalPayable)}
                        </td>
                        <td className="p-3.5">
                          <span className="text-gray-700 block font-mono text-[11px]">{t.bankAccountMasked}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{t.ifscCode}</span>
                        </td>
                        <td className="p-3.5">
                          {t.status === "disbursed" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                              <CheckCircle size={11} /> Disbursed
                            </span>
                          ) : t.status === "approved" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                              <ShieldCheck size={11} /> Approved
                            </span>
                          ) : t.status === "bank-processing" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                              <Clock size={11} /> In Bank Switch
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                              <AlertCircle size={11} /> Pending Review
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <button
                            onClick={() => setSelectedTxn(t)}
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

        {/* Transaction Detail & Action Modal */}
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title={`PFMS Compensation Voucher — ${selectedTxn?.pfmsTxnId}`}
          size="md"
        >
          {selectedTxn && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#EAF0F8] border border-blue-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">Total Entitled Compensation</span>
                  <span className="text-base font-bold text-[#138808]">{formatCurrency(selectedTxn.totalPayable)}</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Beneficiary: <strong>{selectedTxn.beneficiaryName}</strong> ({selectedTxn.aadhaarMasked})
                </p>
              </div>

              <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">Base Assessed Value:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(selectedTxn.assessedAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">100% Statutory Solatium:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(selectedTxn.solatiumAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">12% Interest (Section 30):</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(selectedTxn.interestAmount)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-600 font-bold">Total Payout:</span>
                  <span className="font-bold text-[#1F3864]">{formatCurrency(selectedTxn.totalPayable)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <p className="font-semibold text-gray-700">Bank Destination Account</p>
                <p className="text-gray-600 font-mono text-[11px]">Account: {selectedTxn.bankAccountMasked} · IFSC: {selectedTxn.ifscCode}</p>
                <p className="text-gray-500 text-[10px]">Aadhaar-seeded bank account verified via NPCI mapper.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="px-3.5 py-2 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedTxn.status !== "disbursed" && (
                  <button
                    onClick={() => handleDisburseSingle(selectedTxn.id)}
                    className="px-4 py-2 bg-[#138808] text-white rounded-xl font-bold hover:bg-[#0E5F05] flex items-center gap-1.5"
                  >
                    <Send size={13} />
                    Release PFMS-DBT Payout
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Batch Release Modal */}
        <Modal
          isOpen={batchModalOpen}
          onClose={() => setBatchModalOpen(false)}
          title="Authorise Batch PFMS Compensation Release"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600 leading-relaxed">
              You are about to authorise the release of Direct Benefit Transfer (DBT) payouts for all pre-approved awards under the active acquisition projects.
            </p>
            <div className="bg-[#EAF0F8] p-3 rounded-xl border border-blue-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Approved Beneficiaries in Queue:</span>
                <span className="font-bold text-[#1F3864]">
                  {transactions.filter((t) => t.status === "approved").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Disbursement Amount:</span>
                <span className="font-bold text-[#138808]">
                  {formatCurrency(
                    transactions
                      .filter((t) => t.status === "approved")
                      .reduce((acc, curr) => acc + curr.totalPayable, 0)
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setBatchModalOpen(false)}
                className="px-3.5 py-2 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchRelease}
                className="px-4 py-2 bg-[#138808] text-white rounded-xl font-bold hover:bg-[#0E5F05] flex items-center gap-1.5"
              >
                <Send size={13} />
                Confirm & Dispatch to PFMS
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
