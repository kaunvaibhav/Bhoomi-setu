"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3, Download, Calendar, Filter, FileText, CheckCircle,
  TrendingUp, Layers, RefreshCw, LogOut, Clock, Printer,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import {
  SAMPLE_PROJECTS,
  STATE_AREA_DATA,
  COMPENSATION_DATA,
  STAGE_DISTRIBUTION,
  MONTHLY_PROGRESS,
  UserRole,
  DEMO_ROLES,
} from "@/lib/mockData";
import { formatCurrency, formatArea } from "@/lib/utils";

const COLORS = ["#1F3864", "#138808", "#FF9933", "#0369A1", "#7C3AED", "#D97706"];

export default function DashboardReportsPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const [reportType, setReportType] = useState("executive-summary");
  const [selectedState, setSelectedState] = useState("all");
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast(
        "success",
        `National MIS Report (${reportType.toUpperCase()}.${format}) successfully generated and downloaded!`
      );
    }, 900);
  };

  const handleScheduleReport = () => {
    addToast(
      "info",
      "Automated monthly MIS delivery scheduled to your registered government email address."
    );
  };

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
              <span className="text-sm font-semibold text-[#1F3864]">Executive MIS Reports</span>
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
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1F3864] flex items-center justify-center">
                    <BarChart3 size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">MIS Analytics & Regulatory Reports</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ministry-level cross-state benchmarking, financial audits & possession timeline forecasting
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleScheduleReport}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <Clock size={13} />
                  Schedule Recurring
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1F3864] text-white rounded-xl text-xs font-semibold hover:bg-[#2A4A8A] transition-colors shadow-xs"
                >
                  <Download size={14} className={isGenerating ? "animate-bounce" : ""} />
                  {isGenerating ? "Exporting..." : "Generate MIS Dossier"}
                </button>
              </div>
            </div>

            {/* Report Generator Controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
              <h2 className="text-xs font-bold text-[#1F3864] uppercase tracking-wider">Report Configuration Parameters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Select Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
                  >
                    <option value="executive-summary">Executive National Summary (DoLR)</option>
                    <option value="state-comparative">State-Wise Acquisition & Possession</option>
                    <option value="compensation-pfms">PFMS Compensation Disbursement Audit</option>
                    <option value="bottleneck-analysis">Stage 1-12 Bottleneck & Delay Forecast</option>
                    <option value="rnr-welfare">R&R Beneficiary & Welfare Census</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">State / Territory Scope</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
                  >
                    <option value="all">All States (Pan-India)</option>
                    <option value="UP">Uttar Pradesh</option>
                    <option value="RJ">Rajasthan</option>
                    <option value="MH">Maharashtra</option>
                    <option value="KA">Karnataka</option>
                    <option value="MP">Madhya Pradesh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Export Format</label>
                  <div className="flex gap-2">
                    {(["pdf", "excel", "csv"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setFormat(fmt)}
                        className={`flex-1 py-2 rounded-xl font-bold uppercase text-[10px] transition-colors border ${
                          format === fmt
                            ? "bg-[#1F3864] text-white border-[#1F3864]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Analytics Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Chart 1: State-wise Land Notified vs Acquired */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#1F3864]">State-Wise Land Notified vs Acquired</h3>
                  <span className="text-[10px] text-gray-400">In Hectares (Ha)</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STATE_AREA_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="notified" name="Area Notified" fill="#1F3864" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="acquired" name="Area Acquired" fill="#138808" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Compensation Assessed vs Disbursed */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#1F3864]">PFMS Compensation: Assessed vs Disbursed</h3>
                  <span className="text-[10px] text-gray-400">In ₹ Crores</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={COMPENSATION_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="assessed" name="Assessed Amount" fill="#0369A1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="disbursed" name="Disbursed (PFMS)" fill="#FF9933" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Monthly Acquisition Progress Trends */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#1F3864]">Cumulative Acquisition Growth Trajectory</h3>
                  <span className="text-[10px] text-gray-400">Last 6 Months (Ha)</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MONTHLY_PROGRESS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="notified" name="Notified" stroke="#1F3864" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="acquired" name="Acquired" stroke="#138808" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Stage Distribution */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#1F3864]">Lifecycle Stage Distribution</h3>
                  <span className="text-[10px] text-gray-400">Total Projects in Pipeline</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STAGE_DISTRIBUTION} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="stage" tick={{ fontSize: 10 }} width={80} />
                      <Tooltip />
                      <Bar dataKey="count" name="Projects" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
