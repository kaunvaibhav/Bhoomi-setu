"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardList, ShieldCheck, Search, Filter, Download,
  Eye, CheckCircle, RefreshCw, Lock, Key, LogOut, FileText,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Modal from "@/components/Modal";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import {
  SAMPLE_AUDIT_LOGS,
  AuditLogEntry,
  UserRole,
  DEMO_ROLES,
} from "@/lib/mockData";

export default function DashboardAuditPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const [logs, setLogs] = useState<AuditLogEntry[]>(SAMPLE_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("success", "Immutable audit ledger synchronized with national blockchain node");
    }, 600);
  };

  const handleExportLedger = () => {
    addToast("info", "Generating cryptographic audit ledger package (Signed JSON/CSV)...");
  };

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCat = filterCategory === "all" || l.actionCategory === filterCategory;

    return matchSearch && matchCat;
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
              <span className="text-sm font-semibold text-[#1F3864]">Immutable Audit Trail</span>
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
                    <ShieldCheck size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">Immutable Regulatory Audit Trail</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tamper-evident, cryptographically chained logs of every valuation override, gazette sign-off & fund transfer
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                  Verify Chain
                </button>
                <button
                  onClick={handleExportLedger}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1F3864] text-white rounded-xl text-xs font-semibold hover:bg-[#2A4A8A] transition-colors shadow-xs"
                >
                  <Download size={14} />
                  Export Audit Proof
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Logged System Events</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">{logs.length}</p>
                <p className="text-[10px] text-green-600 font-semibold mt-0.5">100% Cryptographically Verified</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Statutory Approvals</p>
                <p className="text-xl font-bold text-[#138808] mt-1">
                  {logs.filter((l) => l.actionCategory === "Workflow Transition").length}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Section 11 / 19 / Award</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Valuation Audits</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">
                  {logs.filter((l) => l.actionCategory === "Valuation").length}
                </p>
                <p className="text-[10px] text-blue-600 mt-0.5">AI Flag Overrides</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Hashing Algorithm</p>
                <p className="text-xl font-bold text-purple-700 mt-1">SHA-256</p>
                <p className="text-[10px] text-purple-600 mt-0.5">e-Sign Certifying Authority</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search logs by officer name, action title, or ID..."
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
                  <option value="all">All Action Categories</option>
                  <option value="Workflow Transition">Workflow Transition</option>
                  <option value="Valuation">Valuation Scrutiny</option>
                  <option value="Compensation">Compensation DBT Payout</option>
                  <option value="Document Upload">Document / Survey Upload</option>
                  <option value="Security">Security & Access</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 pl-4">Timestamp & ID</th>
                      <th className="p-3.5">Officer & Role</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Action Executed</th>
                      <th className="p-3.5">Gateway IP Hash</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 pr-4 text-right">Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3.5 pl-4">
                          <span className="font-bold text-gray-800 block text-xs">{log.timestamp}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{log.id}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-[#1F3864] block">{log.officerName}</span>
                          <span className="text-[10px] text-gray-500">{log.officerRole} · {log.department}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-[#EAF0F8] text-[#1F3864] rounded-md font-semibold text-[10px]">
                            {log.actionCategory}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-800 block">{log.actionTitle}</span>
                          <span className="text-[11px] text-gray-500 line-clamp-1 max-w-xs">{log.actionDetails}</span>
                        </td>
                        <td className="p-3.5 font-mono text-[10.5px] text-gray-500">{log.ipHash}</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 text-green-700 font-bold text-[10px]">
                            <CheckCircle size={12} /> Verified
                          </span>
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-[#EAF0F8] text-[#1F3864] rounded-lg text-xs font-semibold transition-colors"
                          >
                            Inspect Hash
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

        {/* Cryptographic Inspector Modal */}
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Cryptographic Audit Receipt — ${selectedLog?.id}`}
          size="md"
        >
          {selectedLog && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-700" />
                  <div>
                    <span className="text-[10px] font-bold text-green-800 uppercase">Integrity Status</span>
                    <p className="font-bold text-green-900">Valid & Tamper-Free</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-green-700 bg-white px-2 py-1 rounded border border-green-200">
                  Block #89104
                </span>
              </div>

              <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">Executing Authority:</span>
                  <span className="font-bold text-gray-800">{selectedLog.officerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Official Designation:</span>
                  <span className="font-medium text-gray-700">{selectedLog.officerRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Government Gateway IP:</span>
                  <span className="font-mono text-gray-700">{selectedLog.ipHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="font-medium text-gray-700">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Action Execution Statement</span>
                <p className="text-gray-800 leading-relaxed font-medium">{selectedLog.actionDetails}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 font-mono text-[10px]">
                <span className="text-blue-800 font-bold block font-sans text-xs">Digital Signature Hash (SHA-256)</span>
                <p className="text-blue-900 break-all select-all">{selectedLog.signatureHash}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-[#1F3864] text-white rounded-xl font-bold hover:bg-[#2A4A8A]"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
