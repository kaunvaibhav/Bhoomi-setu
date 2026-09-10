"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RefreshCw, Download, Filter, Bell, Search, ChevronDown,
  AlertTriangle, TrendingUp, BarChart3, MapPin, Brain, User, LogOut,
  Menu, X,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import KpiCard from "@/components/KpiCard";
import ProjectTable from "@/components/ProjectTable";
import MapPanel from "@/components/MapPanel";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { type UserRole, NATIONAL_KPIS, STATE_AREA_DATA, COMPENSATION_DATA, STAGE_DISTRIBUTION, MONTHLY_PROGRESS, SAMPLE_PROJECTS, DASHBOARD_ALERTS, DEMO_ROLES } from "@/lib/mockData";
import { formatArea, formatCurrency } from "@/lib/utils";

const STAGE_COLORS = ["#1F3864", "#2A4A8A", "#138808", "#0369A1", "#7C3AED", "#B45309", "#065F46", "#DC2626"];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "map" | "charts">("overview");
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const roleConfig = DEMO_ROLES[role];

  const dashTitle: Record<UserRole, string> = {
    ministry: "National Acquisition Overview",
    state: "State Overview — Uttar Pradesh",
    district: "District Overview — Varanasi",
    pia: "PIA Dashboard — NHAI",
    field: "Field Officer Dashboard",
    citizen: "Citizen Portal",
  };

  const projects = role === "district"
    ? SAMPLE_PROJECTS.filter((p) => p.state === "Uttar Pradesh")
    : role === "pia"
    ? SAMPLE_PROJECTS.filter((p) => p.requiringBody === "National Highways Authority of India")
    : SAMPLE_PROJECTS;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [role]);

  function handleRefresh() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast("success", "Dashboard data refreshed");
    }, 1000);
  }

  function handleExport() {
    addToast("info", "Report export started. File will download shortly.");
  }

  const kpis = [
    {
      title: "Area Notified",
      value: formatArea(NATIONAL_KPIS.areaNotified),
      subtitle: "Across active projects",
      trend: "up" as const,
      trendValue: `+${NATIONAL_KPIS.areaNotifiedChange}%`,
      accent: "#1F3864",
      badge: "Illustrative sample",
    },
    {
      title: "Area Acquired",
      value: formatArea(NATIONAL_KPIS.areaAcquired),
      subtitle: `${NATIONAL_KPIS.areaAcquiredPercent}% of notified area`,
      trend: "up" as const,
      trendValue: "+2.1%",
      accent: "#138808",
      badge: "Illustrative sample",
    },
    {
      title: "Compensation Disbursed",
      value: formatCurrency(NATIONAL_KPIS.compensationDisbursed, "cr"),
      subtitle: `${NATIONAL_KPIS.compensationDisbursedPercent}% of assessed amount`,
      trend: "up" as const,
      trendValue: "+3.4%",
      accent: "#065F46",
      badge: "Illustrative sample",
    },
    {
      title: "Possession Progress",
      value: `${NATIONAL_KPIS.possessionProgress}%`,
      subtitle: "Across active projects",
      trend: "up" as const,
      trendValue: "+1.2%",
      accent: "#0369A1",
      badge: "Illustrative sample",
    },
    {
      title: "Valuation Flags",
      value: `${NATIONAL_KPIS.valuationFlags} Awards`,
      subtitle: "Require manual review",
      trend: "neutral" as const,
      trendValue: "Needs attention",
      accent: "#DC2626",
      badge: "Illustrative sample",
    },
  ];

  return (
    <ProtectedRoute>
      <TopUtilityBar />
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Dashboard top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>
              <Link href="/" className="text-[#1F3864] font-bold text-lg">BhoomiSetu</Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-600 truncate max-w-[160px] sm:max-w-none">{dashTitle[role]}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-52">
                <Search size={14} className="text-gray-400" />
                <input placeholder="Search projects..." className="bg-transparent text-xs text-gray-600 outline-none w-full placeholder-gray-400" aria-label="Search projects" />
              </div>
              {/* Notification */}
              <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100" aria-label={`Notifications: ${DASHBOARD_ALERTS.length} alerts`}>
                <Bell size={17} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9933]" aria-hidden="true" />
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <span className="font-bold text-sm text-[#1F3864]">Dashboard Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DashboardSidebar currentRole={role} onClose={() => setMobileSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Layout */}
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar currentRole={role} />
          </div>

          {/* Main content */}
          <main id="main-content" className="flex-1 min-w-0 p-5 space-y-5">
            {/* Page header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-[#1F3864]">{dashTitle[role]}</h1>
                  {role === "ministry" && (
                    <span className="text-[10px] font-semibold text-[#1F3864] bg-[#EAF0F8] px-2.5 py-0.5 rounded-full border border-blue-200">
                      Ministry of Rural Development | Department of Land Resources (DoLR)
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ministry of Rural Development → Department of Land Resources (DoLR) · Real-time monitoring · <span className="italic">Prototype data</span>
                </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-gray-400 hidden sm:block">Last synced: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  aria-label="Refresh dashboard data"
                >
                  <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1F3864] text-white rounded-xl hover:bg-[#2A4A8A] transition-colors"
                  aria-label="Export report"
                >
                  <Download size={13} />
                  Export
                </button>
              </div>
            </div>

            {/* Role-Specific Contextual Card */}
            {role === "citizen" && (
              <div className="bg-white rounded-2xl border-2 border-green-200 p-5 shadow-card bg-gradient-to-r from-green-50/50 via-white to-blue-50/30">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                      RP
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#1F3864]">
                        Welcome, Ramesh Chandra Patel (Registered Citizen & Landholder)
                      </h2>
                      <p className="text-xs text-gray-500">
                        Active Case ID: <span className="font-mono font-bold text-[#1F3864]">BS-UP-2026-004821</span> · Eastern Freight Connectivity Corridor
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/track-case/BS-UP-2026-004821"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#138808] text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-xs"
                  >
                    View My Full Case Record →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-green-100 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Parcel ID</span>
                    <span className="font-semibold text-gray-800">UP-AGR-004821</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Land Area Notified</span>
                    <span className="font-semibold text-gray-800">0.85 Hectares</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Compensation Assessed</span>
                    <span className="font-bold text-[#1F3864]">₹42,00,000 (Award Declared)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Status</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Stage 8 · Award Review
                    </span>
                  </div>
                </div>
              </div>
            )}

            {role === "pia" && (
              <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-card flex flex-wrap items-center justify-between gap-3 bg-emerald-50/40">
                <div>
                  <h2 className="text-sm font-bold text-emerald-950">
                    PIA Workspace: National Highways Authority of India (NHAI)
                  </h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Authorized Officer: Vikramaditya Singh · 4 active corridors undergoing land acquisition
                  </p>
                </div>
                <Link
                  href="/projects/new"
                  className="px-3.5 py-1.5 bg-[#065F46] text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  + Submit New Project Proposal
                </Link>
              </div>
            )}

            {/* Prototype data badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <AlertTriangle size={12} />
              Prototype data — all values are illustrative sample data
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {kpis.map((kpi) => (
                <KpiCard
                  key={kpi.title}
                  {...kpi}
                  isLoading={loading}
                  icon={<TrendingUp size={15} />}
                />
              ))}
            </div>

            {/* Alerts panel */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
              <h2 className="text-sm font-semibold text-[#1F3864] mb-3 flex items-center gap-2">
                <Bell size={15} className="text-[#FF9933]" />
                Active Alerts
                <span className="ml-auto text-xs text-gray-400">Requires attention</span>
              </h2>
              <div className="space-y-2">
                {DASHBOARD_ALERTS.map((alert) => (
                  <Link
                    key={alert.id}
                    href={alert.link}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-colors hover:opacity-80 ${
                      alert.type === "danger" ? "bg-red-50 border border-red-200 text-red-700" :
                      alert.type === "warning" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                      "bg-blue-50 border border-blue-200 text-blue-700"
                    }`}
                  >
                    <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                    <span>{alert.message}</span>
                    <span className="ml-auto flex-shrink-0 text-[10px] underline">View →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
              {(["overview", "map", "charts"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    activeTab === tab ? "bg-white text-[#1F3864] shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-pressed={activeTab === tab}
                >
                  {tab === "overview" ? "Projects" : tab === "map" ? "Map View" : "Analytics"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "overview" && (
              <ProjectTable projects={projects} isLoading={loading} />
            )}

            {activeTab === "map" && (
              <MapPanel
                highlightedState={selectedState}
                onStateClick={(id) => setSelectedState(id === selectedState ? undefined : id)}
                compact={false}
              />
            )}

            {activeTab === "charts" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Area chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Area Notified vs Acquired by State (ha)</h3>
                  <p className="text-[10px] text-gray-400 italic mb-3">Illustrative sample data</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={STATE_AREA_DATA} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => typeof v === "number" ? v.toLocaleString("en-IN") + " ha" : v} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="notified" name="Notified" fill="#1F3864" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="acquired" name="Acquired" fill="#138808" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Compensation chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Compensation Assessed vs Disbursed (₹ Cr)</h3>
                  <p className="text-[10px] text-gray-400 italic mb-3">Illustrative sample data</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={COMPENSATION_DATA} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => typeof v === "number" ? "₹" + v.toLocaleString("en-IN") + " Cr" : v} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="assessed" name="Assessed" fill="#7C3AED" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="disbursed" name="Disbursed" fill="#059669" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Stage distribution */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Stage-wise Case Distribution</h3>
                  <p className="text-[10px] text-gray-400 italic mb-3">Illustrative sample data</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={STAGE_DISTRIBUTION} margin={{ top: 0, right: 0, left: -10, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="stage" type="category" tick={{ fontSize: 9 }} width={70} />
                      <Tooltip />
                      <Bar dataKey="count" name="Cases" fill="#1F3864" radius={[0, 3, 3, 0]}>
                        {STAGE_DISTRIBUTION.map((_, i) => (
                          <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly trend */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Monthly Progress Trend (ha)</h3>
                  <p className="text-[10px] text-gray-400 italic mb-3">Illustrative sample data</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={MONTHLY_PROGRESS} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => typeof v === "number" ? v.toLocaleString("en-IN") + " ha" : v} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="notified" name="Notified" stroke="#1F3864" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="acquired" name="Acquired" stroke="#138808" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </ProtectedRoute>
  );
}
