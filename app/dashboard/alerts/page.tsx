"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell, AlertTriangle, AlertCircle, Info, CheckCircle2,
  ArrowRight, Filter, Check, Send, LogOut, RefreshCw,
  Brain, FileText, Calendar,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import { UserRole, DEMO_ROLES } from "@/lib/mockData";

interface AlertItem {
  id: string;
  type: "danger" | "warning" | "info";
  category: "Valuation" | "Timeline" | "Document" | "R&R";
  title: string;
  description: string;
  timestamp: string;
  link: string;
  linkText: string;
  isRead: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "ALT-001",
    type: "danger",
    category: "Valuation",
    title: "12 Valuation Awards Require Collector Scrutiny",
    description: "AI Anomaly Detection scored compensation awards > 60% deviation from historical circle rates in Varanasi and Jaisalmer sectors.",
    timestamp: "10 mins ago",
    link: "/valuation-review",
    linkText: "Open AI Valuation Review",
    isRead: false,
  },
  {
    id: "ALT-002",
    type: "warning",
    category: "Timeline",
    title: "Possession Milestone Delay Risk — Krishna Basin Scheme",
    description: "Stage 7 land survey is 14 days behind schedule due to pending boundary verification in 2 villages.",
    timestamp: "1 hour ago",
    link: "/projects/PROJ-KA-004",
    linkText: "Inspect Project Lifecycle",
    isRead: false,
  },
  {
    id: "ALT-003",
    type: "warning",
    category: "Document",
    title: "4 Section 19 Gazette Declarations Awaiting State Digital Signature",
    description: "Objection hearing periods elapsed with zero pending objections. Requires authorized e-Sign stamp.",
    timestamp: "3 hours ago",
    link: "/dashboard/documents",
    linkText: "Open Gazette Vault",
    isRead: false,
  },
  {
    id: "ALT-004",
    type: "info",
    category: "R&R",
    title: "7 R&R Family Beneficiary Details Verified for DBT Release",
    description: "Aadhaar and bank account validation confirmed by PFMS switch for Model Resettlement Colony B.",
    timestamp: "5 hours ago",
    link: "/dashboard/rnr",
    linkText: "View R&R Beneficiaries",
    isRead: true,
  },
];

export default function DashboardAlertsPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("success", "System alerts and escalation triggers updated");
    }, 600);
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    addToast("success", "All notification alerts marked as read");
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    addToast("success", `Alert ${id} acknowledged and removed from active priority queue.`);
  };

  const handleForwardAlert = (id: string) => {
    addToast("info", `Alert ${id} escalated to District Collector & State Nodal Officer.`);
  };

  const filtered = alerts.filter((a) => {
    const matchCat = filterCategory === "all" || a.category === filterCategory;
    const matchType = filterType === "all" || a.type === filterType;
    return matchCat && matchType;
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
              <span className="text-sm font-semibold text-[#1F3864]">System Alerts Hub</span>
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
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">Unified Alerts & Action Items Hub</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Automated regulatory warnings, AI valuation flags, and statutory deadline escalations
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
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-[#1F3864] rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors shadow-2xs"
                >
                  <Check size={14} />
                  Mark All as Read
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Total Active Alerts</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">{alerts.length}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Real-time triggers</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Critical (High Urgency)</p>
                <p className="text-xl font-bold text-red-600 mt-1">
                  {alerts.filter((a) => a.type === "danger").length}
                </p>
                <p className="text-[10px] text-red-500 mt-0.5">Requires immediate action</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Warnings & Milestones</p>
                <p className="text-xl font-bold text-amber-600 mt-1">
                  {alerts.filter((a) => a.type === "warning").length}
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">Deadline tracking</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Unread Notifications</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {alerts.filter((a) => !a.isRead).length}
                </p>
                <p className="text-[10px] text-blue-600 mt-0.5">Pending acknowledgment</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All Alert Categories</option>
                  <option value="Valuation">Valuation & AI Flags</option>
                  <option value="Timeline">Timeline & Milestones</option>
                  <option value="Document">Gazette & Documents</option>
                  <option value="R&R">R&R Entitlements</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All Urgency Levels</option>
                  <option value="danger">Critical (Red)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="info">Informational (Blue)</option>
                </select>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.type === "danger"
                      ? "bg-red-50/40 border-red-200 hover:border-red-300"
                      : item.type === "warning"
                      ? "bg-amber-50/40 border-amber-200 hover:border-amber-300"
                      : "bg-blue-50/40 border-blue-200 hover:border-blue-300"
                  } ${!item.isRead ? "shadow-2xs ring-1 ring-blue-400/30" : ""}`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.type === "danger"
                          ? "bg-red-100 text-red-700"
                          : item.type === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.type === "danger" ? (
                        <AlertTriangle size={18} />
                      ) : item.type === "warning" ? (
                        <AlertCircle size={18} />
                      ) : (
                        <Info size={18} />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400 font-mono">{item.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-gray-200 text-gray-600">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" title="Unread" />
                        )}
                      </div>

                      <h2 className="text-sm font-bold text-[#1F3864] leading-tight">
                        {item.title}
                      </h2>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 sm:self-center">
                    <Link
                      href={item.link}
                      className="px-3 py-1.5 bg-[#1F3864] text-white rounded-xl text-xs font-semibold hover:bg-[#2A4A8A] transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight size={13} />
                    </Link>
                    <button
                      onClick={() => handleForwardAlert(item.id)}
                      className="p-1.5 text-gray-500 hover:text-[#1F3864] hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-colors"
                      title="Escalate to Collector"
                    >
                      <Send size={14} />
                    </button>
                    <button
                      onClick={() => handleResolveAlert(item.id)}
                      className="p-1.5 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                      title="Mark resolved"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                  <CheckCircle2 size={36} className="mx-auto text-green-600 mb-2" />
                  <h3 className="text-sm font-bold text-gray-800">All alerts resolved</h3>
                  <p className="text-xs text-gray-500 mt-1">There are no pending warnings matching your selected criteria.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
