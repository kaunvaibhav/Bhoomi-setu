"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RefreshCw, Download, Filter, Bell, Search,
  AlertTriangle, TrendingUp, BarChart3, MapPin, DollarSign,
  Menu, X, Compass, FileText, CheckCircle2, ShieldCheck,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, Cell, ResponsiveContainer,
} from "recharts";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import KpiCard from "@/components/KpiCard";
import ProjectTable from "@/components/ProjectTable";
import MapPanel from "@/components/MapPanel";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  type UserRole,
  NATIONAL_KPIS,
  STATE_AREA_DATA,
  COMPENSATION_DATA,
  STAGE_DISTRIBUTION,
  MONTHLY_PROGRESS,
  SAMPLE_PROJECTS,
  DASHBOARD_ALERTS,
  DEMO_ROLES,
} from "@/lib/mockData";
import { formatArea, formatCurrency } from "@/lib/utils";

const STAGE_COLORS = ["#1F3864", "#2A4A8A", "#138808", "#0369A1", "#7C3AED", "#B45309", "#065F46", "#DC2626"];

export default function DashboardPage() {
  const { user } = useAuth();
  const rawRole: UserRole = (user?.role as UserRole) || "ministry";
  const role: UserRole = rawRole === "field" ? "lao" : rawRole;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "map" | "charts" | "notices">("overview");
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const dashTitle: Record<UserRole, string> = {
    ministry: "National Land Acquisition Command & Decision Support",
    state: "State Land Acquisition Command — Uttar Pradesh",
    district: "District Administration & Acquisition Unit — Varanasi",
    lao: "Land Acquisition Officer (LAO) — Operational Workbench",
    field: "Land Acquisition Officer (LAO) — Operational Workbench",
    pia: "Project Implementing Agency (PIA) Workspace — NHAI",
    citizen: "Citizen Landholder Portal & Case Tracking",
  };

  const dashSubtitle: Record<UserRole, string> = {
    ministry: "Ministry of Rural Development · Department of Land Resources (DoLR) · National Portfolio",
    state: "Revenue & Land Reforms Department · Government of Uttar Pradesh · State Supervision",
    district: "Office of the District Collector & District Magistrate · Varanasi Administrative Unit",
    lao: "Competent Authority Land Acquisition (CALA) · Operational Scrutiny & Field Execution",
    field: "Competent Authority Land Acquisition (CALA) · Operational Scrutiny & Field Execution",
    pia: "National Highways Authority of India (NHAI) · Corridor Land Acquisition & Requirements",
    citizen: "Registered Landowner Portal · RFCTLARR Act 2013 Statutory Beneficiary View",
  };

  // Filter projects by authenticated role jurisdiction
  const projects =
    role === "district"
      ? SAMPLE_PROJECTS.filter((p) => p.district === "Varanasi" || p.state === "Uttar Pradesh")
      : role === "state"
      ? SAMPLE_PROJECTS.filter((p) => p.state === "Uttar Pradesh")
      : role === "pia"
      ? SAMPLE_PROJECTS.filter((p) => p.requiringBody === "National Highways Authority of India")
      : role === "lao"
      ? SAMPLE_PROJECTS.filter((p) => p.district === "Varanasi")
      : role === "citizen"
      ? SAMPLE_PROJECTS.filter((p) => p.id === "PROJ-UP-001")
      : SAMPLE_PROJECTS;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [role]);

  function handleRefresh() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast("success", "Dashboard data synchronized with official registers.");
    }, 800);
  }

  function handleExport() {
    addToast("info", "MIS Decision Support Report export generated (Excel/PDF).");
  }

  // Role-tailored KPIs
  const getKpis = () => {
    switch (role) {
      case "citizen":
        return [
          {
            title: "My Land Area",
            value: "0.85 ha",
            subtitle: "Plot No. 482/1, Ramnagar",
            trend: "neutral" as const,
            trendValue: "Notified",
            accent: "#1F3864",
            badge: "Section 11(1)",
          },
          {
            title: "Assessed Compensation",
            value: "₹42,00,000",
            subtitle: "Includes 100% Solatium",
            trend: "up" as const,
            trendValue: "Award Declared",
            accent: "#138808",
            badge: "Section 23 Decree",
          },
          {
            title: "Payment Status",
            value: "PFMS Approved",
            subtitle: "Bank A/C: SBI ****4821",
            trend: "up" as const,
            trendValue: "Disbursement Ready",
            accent: "#065F46",
            badge: "Direct DBT",
          },
          {
            title: "Lifecycle Stage",
            value: "Stage 8 of 12",
            subtitle: "Award Review & Hearing",
            trend: "neutral" as const,
            trendValue: "Active",
            accent: "#0369A1",
            badge: "In Progress",
          },
          {
            title: "Hearing Status",
            value: "Completed",
            subtitle: "Collector Chamber Hearing",
            trend: "up" as const,
            trendValue: "Recorded",
            accent: "#7C3AED",
            badge: "Section 15",
          },
        ];
      case "lao":
        return [
          {
            title: "Assigned Parcels",
            value: "24 Plots",
            subtitle: "Varanasi Sub-Division",
            trend: "neutral" as const,
            trendValue: "Active Roster",
            accent: "#92400E",
            badge: "Field Roster",
          },
          {
            title: "Survey Demarcation",
            value: "18 / 24",
            subtitle: "75% Geo-tagged via PWA",
            trend: "up" as const,
            trendValue: "+3 this week",
            accent: "#138808",
            badge: "Mobile PWA",
          },
          {
            title: "Bank KYC Verified",
            value: "21 / 24",
            subtitle: "88% Pre-validated with PFMS",
            trend: "up" as const,
            trendValue: "3 pending",
            accent: "#065F46",
            badge: "PFMS Ready",
          },
          {
            title: "Award Drafts Prepared",
            value: "3 Awards",
            subtitle: "Awaiting Collector approval",
            trend: "neutral" as const,
            trendValue: "Submitted",
            accent: "#0369A1",
            badge: "Section 23",
          },
          {
            title: "Possession Inspections",
            value: "2 Ready",
            subtitle: "Post-compensation handover",
            trend: "up" as const,
            trendValue: "Stage 10",
            accent: "#1F3864",
            badge: "Physical Possession",
          },
        ];
      case "district":
        return [
          {
            title: "District Notified Area",
            value: "1,420 ha",
            subtitle: "Across Varanasi Corridors",
            trend: "up" as const,
            trendValue: "+4.2%",
            accent: "#0369A1",
            badge: "District Scope",
          },
          {
            title: "Area Acquired",
            value: "880 ha",
            subtitle: "62% of notified district area",
            trend: "up" as const,
            trendValue: "On Schedule",
            accent: "#138808",
            badge: "Possession",
          },
          {
            title: "PFMS Disbursed",
            value: "₹142.5 Cr",
            subtitle: "78% of total assessed amount",
            trend: "up" as const,
            trendValue: "+₹18 Cr",
            accent: "#065F46",
            badge: "PFMS Sanctioned",
          },
          {
            title: "Objections Pending",
            value: "2 Hearings",
            subtitle: "Section 15 statutory period",
            trend: "neutral" as const,
            trendValue: "Scheduled",
            accent: "#B45309",
            badge: "Collector Hearing",
          },
          {
            title: "Valuation Anomaly Flags",
            value: "12 Awards",
            subtitle: "AI circle-rate deviation",
            trend: "neutral" as const,
            trendValue: "Requires Review",
            accent: "#DC2626",
            badge: "AI Checkpoint",
          },
        ];
      case "state":
        return [
          {
            title: "State Area Notified",
            value: "8,420 ha",
            subtitle: "Across 14 UP Projects",
            trend: "up" as const,
            trendValue: "+6.8%",
            accent: "#7C3AED",
            badge: "UP Statewide",
          },
          {
            title: "State Area Acquired",
            value: "5,220 ha",
            subtitle: "62% acquisition rate",
            trend: "up" as const,
            trendValue: "4 districts leading",
            accent: "#138808",
            badge: "State Aggregate",
          },
          {
            title: "Compensation Disbursed",
            value: "₹1,850 Cr",
            subtitle: "74% of assessed state compensation",
            trend: "up" as const,
            trendValue: "+5.1%",
            accent: "#065F46",
            badge: "Treasury Sync",
          },
          {
            title: "Gazette Declarations",
            value: "14 Issued",
            subtitle: "4 pending digital signature",
            trend: "neutral" as const,
            trendValue: "Action required",
            accent: "#0369A1",
            badge: "Section 11 & 19",
          },
          {
            title: "R&R Families Resettled",
            value: "1,240 PAFs",
            subtitle: "Resettlement Colonies Approved",
            trend: "up" as const,
            trendValue: "88% of target",
            accent: "#1F3864",
            badge: "R&R Scheme",
          },
        ];
      case "pia":
        return [
          {
            title: "Total Land Required",
            value: "2,840 ha",
            subtitle: "4 NHAI Corridor Projects",
            trend: "neutral" as const,
            trendValue: "DPR Baseline",
            accent: "#065F46",
            badge: "Agency Scope",
          },
          {
            title: "Land Handed Over",
            value: "1,620 ha",
            subtitle: "57% of total corridor requirement",
            trend: "up" as const,
            trendValue: "+140 ha this mo",
            accent: "#138808",
            badge: "Stage 10 Handover",
          },
          {
            title: "Corridor Adherence",
            value: "82% On-Time",
            subtitle: "Key EPC construction milestones",
            trend: "up" as const,
            trendValue: "High Progress",
            accent: "#1F3864",
            badge: "Milestones",
          },
          {
            title: "Pending Clearances",
            value: "1 Section 19",
            subtitle: "Awaiting State Gazette e-Sign",
            trend: "neutral" as const,
            trendValue: "Follow-up",
            accent: "#B45309",
            badge: "Bottleneck",
          },
          {
            title: "Active Proposals",
            value: "4 Corridors",
            subtitle: "Eastern & Bundelkhand Links",
            trend: "neutral" as const,
            trendValue: "In Workflow",
            accent: "#0369A1",
            badge: "Proposals",
          },
        ];
      case "ministry":
      default:
        return [
          {
            title: "National Area Notified",
            value: formatArea(NATIONAL_KPIS.areaNotified),
            subtitle: "Across 28 States & UTs",
            trend: "up" as const,
            trendValue: `+${NATIONAL_KPIS.areaNotifiedChange}%`,
            accent: "#1F3864",
            badge: "National View",
          },
          {
            title: "National Area Acquired",
            value: formatArea(NATIONAL_KPIS.areaAcquired),
            subtitle: `${NATIONAL_KPIS.areaAcquiredPercent}% of notified area`,
            trend: "up" as const,
            trendValue: "+2.1%",
            accent: "#138808",
            badge: "National View",
          },
          {
            title: "Compensation Disbursed",
            value: formatCurrency(NATIONAL_KPIS.compensationDisbursed, "cr"),
            subtitle: `${NATIONAL_KPIS.compensationDisbursedPercent}% of assessed amount`,
            trend: "up" as const,
            trendValue: "+3.4%",
            accent: "#065F46",
            badge: "PFMS National",
          },
          {
            title: "Possession Progress",
            value: `${NATIONAL_KPIS.possessionProgress}%`,
            subtitle: "Across 184 active projects",
            trend: "up" as const,
            trendValue: "+1.2%",
            accent: "#0369A1",
            badge: "All Corridors",
          },
          {
            title: "Valuation Anomaly Flags",
            value: `${NATIONAL_KPIS.valuationFlags} Awards`,
            subtitle: "AI circle-rate deviation flags",
            trend: "neutral" as const,
            trendValue: "Requires Attention",
            accent: "#DC2626",
            badge: "AI Checkpoint",
          },
        ];
    }
  };

  const kpis = getKpis();

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
              {role !== "citizen" && (
                <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-52">
                  <Search size={14} className="text-gray-400" />
                  <input placeholder="Search projects or parcels..." className="bg-transparent text-xs text-gray-600 outline-none w-full placeholder-gray-400" aria-label="Search" />
                </div>
              )}
              <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 cursor-pointer" aria-label="Notifications">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-[#1F3864]">{dashTitle[role]}</h1>
                  <span
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                    style={{ backgroundColor: `${roleConfig.color}15`, borderColor: `${roleConfig.color}35`, color: roleConfig.color }}
                  >
                    {roleConfig.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {dashSubtitle[role]}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-gray-400 hidden sm:block">
                  Synced: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-label="Refresh dashboard data"
                >
                  <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
                {role !== "citizen" && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1F3864] text-white rounded-xl hover:bg-[#2A4A8A] transition-colors cursor-pointer"
                    aria-label="Export report"
                  >
                    <Download size={13} />
                    Export MIS
                  </button>
                )}
              </div>
            </div>

            {/* ── ROLE-SPECIFIC CONTEXTUAL WORKSPACE BANNERS ── */}

            {/* 1. CITIZEN LANDHOLDER CARD */}
            {role === "citizen" && (
              <div className="bg-white rounded-2xl border-2 border-green-300 p-5 shadow-card bg-gradient-to-r from-green-50/70 via-white to-blue-50/40">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-green-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                      RP
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#1F3864]">
                          Ramesh Chandra Patel
                        </h2>
                        <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full border border-green-300">
                          Registered Landowner
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Case ID: <span className="font-mono font-bold text-[#1F3864]">BS-UP-2026-004821</span> · Corridor: <span className="font-semibold text-gray-700">Eastern Freight Connectivity Corridor</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/track-case/BS-UP-2026-004821"
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#138808] text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-xs"
                    >
                      Track My Case Timeline →
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-green-200 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-green-100">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Survey Plot & Village</span>
                    <span className="font-bold text-gray-900 mt-0.5 block">Plot 482/1 · Ramnagar</span>
                    <span className="text-[10px] text-gray-500">Varanasi, Uttar Pradesh</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-green-100">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Notified Area</span>
                    <span className="font-bold text-gray-900 mt-0.5 block">0.85 Hectares</span>
                    <span className="text-[10px] text-green-700 font-semibold">Demarcation verified</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-green-100">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Award Compensation</span>
                    <span className="font-bold text-[#1F3864] mt-0.5 block text-sm">₹42,00,000</span>
                    <span className="text-[10px] text-gray-500">Includes 100% solatium decree</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-green-100">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Statutory Status</span>
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 mt-0.5 block">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Stage 8 · Award Review
                    </span>
                    <span className="text-[10px] text-gray-500">Hearing attended; decree final</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LAND ACQUISITION OFFICER (LAO) WORKBENCH CARD */}
            {role === "lao" && (
              <div className="bg-white rounded-2xl border border-amber-300 p-4 shadow-card bg-gradient-to-r from-amber-50/60 via-white to-blue-50/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-amber-950">
                        Operational Workbench: Competent Authority Land Acquisition (CALA) Unit
                      </h2>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                        Varanasi Jurisdiction
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      LAO In-Charge: Sanjay Verma · 24 Cadastral Parcels Assigned · 3 Preliminary Scrutiny Tasks Active
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href="/dashboard/field-survey"
                      className="px-3 py-1.5 bg-[#92400E] text-white text-xs font-semibold rounded-xl hover:bg-amber-800 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Compass size={13} />
                      Launch Field Survey PWA
                    </Link>
                    <Link
                      href="/valuation-review"
                      className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-semibold rounded-xl hover:bg-amber-50 transition-colors"
                    >
                      AI Valuation Calculator
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DISTRICT COLLECTOR STATUTORY CARD */}
            {role === "district" && (
              <div className="bg-white rounded-2xl border border-sky-300 p-4 shadow-card bg-gradient-to-r from-sky-50/60 via-white to-blue-50/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-[#0369A1]">
                        District Land Acquisition Authority: Varanasi District
                      </h2>
                      <span className="text-[10px] bg-sky-100 text-sky-900 font-bold px-2 py-0.5 rounded-full border border-sky-300">
                        Priya Nair, IAS · District Collector
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Statutory Authority under RFCTLARR Act 2013 · 2 Objection Hearings (Section 15) Pending Disposal · 3 Awards Pending Approval
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href="/dashboard/compensation"
                      className="px-3 py-1.5 bg-[#0369A1] text-white text-xs font-semibold rounded-xl hover:bg-sky-800 transition-colors shadow-xs"
                    >
                      PFMS Batch Sanction
                    </Link>
                    <Link
                      href="/valuation-review"
                      className="px-3 py-1.5 bg-white border border-sky-300 text-sky-900 text-xs font-semibold rounded-xl hover:bg-sky-50 transition-colors"
                    >
                      Award Decrees Approval
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 4. STATE GOVERNMENT OFFICER CARD */}
            {role === "state" && (
              <div className="bg-white rounded-2xl border border-purple-300 p-4 shadow-card bg-gradient-to-r from-purple-50/60 via-white to-blue-50/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-[#7C3AED]">
                        State Acquisition Command: Government of Uttar Pradesh
                      </h2>
                      <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full border border-purple-300">
                        Ananya Sen, IAS · State Land Officer
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Supervising 14 Active Projects across 75 Districts · 4 Section 11/19 Gazette Notifications Pending Digital Signature
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href="/dashboard/documents"
                      className="px-3 py-1.5 bg-[#7C3AED] text-white text-xs font-semibold rounded-xl hover:bg-purple-800 transition-colors shadow-xs"
                    >
                      e-Sign Gazette Vault
                    </Link>
                    <Link
                      href="/dashboard/reports"
                      className="px-3 py-1.5 bg-white border border-purple-300 text-purple-900 text-xs font-semibold rounded-xl hover:bg-purple-50 transition-colors"
                    >
                      Generate State MIS
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 5. PIA OFFICER CARD */}
            {role === "pia" && (
              <div className="bg-white rounded-2xl border border-emerald-300 p-4 shadow-card flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/30">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-emerald-950">
                      PIA Workspace: National Highways Authority of India (NHAI)
                    </h2>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      Northern Zone
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Officer: Vikramaditya Singh · 4 Highway & Freight Corridors Under Acquisition · 1,620 ha Acquired of 2,840 ha Required
                  </p>
                </div>
                <Link
                  href="/projects/new"
                  className="px-3.5 py-2 bg-[#065F46] text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>+</span> Submit New Project Proposal
                </Link>
              </div>
            )}

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

            {/* ── ALERTS PANEL (Role Scoped) ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4">
              <h2 className="text-sm font-semibold text-[#1F3864] mb-3 flex items-center gap-2">
                <Bell size={15} className="text-[#FF9933]" />
                {role === "citizen" ? "My Case Notifications & Statutory Notices" : "Active Regulatory & Operational Alerts"}
                <span className="ml-auto text-xs text-gray-400">Requires attention</span>
              </h2>
              <div className="space-y-2">
                {role === "citizen" ? (
                  <>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl text-xs bg-blue-50 border border-blue-200 text-blue-800">
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-blue-600" />
                      <div>
                        <span className="font-bold block">Section 11(1) Preliminary Notice Published in Gazette</span>
                        <span className="text-[11px] text-blue-700">Notification Ref: UP-GAZ-2026-S11-042. Restriction on land transaction active for plot 482/1.</span>
                      </div>
                      <Link href="/notifications" className="ml-auto flex-shrink-0 text-[11px] font-semibold underline text-[#1F3864]">View Gazette →</Link>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl text-xs bg-green-50 border border-green-200 text-green-800">
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-green-600" />
                      <div>
                        <span className="font-bold block">Compensation Award Finalized (₹42,00,000)</span>
                        <span className="text-[11px] text-green-700">Bank account SBI ****4821 verified. Payment scheduled for direct PFMS-DBT dispatch.</span>
                      </div>
                      <Link href="/dashboard/compensation" className="ml-auto flex-shrink-0 text-[11px] font-semibold underline text-green-800">Verify Account →</Link>
                    </div>
                  </>
                ) : (
                  DASHBOARD_ALERTS.map((alert) => (
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
                  ))
                )}
              </div>
            </div>

            {/* ── TAB NAVIGATION & VIEWS ── */}
            {role === "citizen" ? (
              /* CITIZEN EXCLUSIVE TABS AND VIEWS (Strictly hides macro charts) */
              <div className="space-y-4">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                  {[
                    { id: "overview", label: "My Case Information" },
                    { id: "notices", label: "Statutory Notices & Gazette" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        activeTab === t.id ? "bg-white text-[#1F3864] shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Land parcel details */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card space-y-3">
                      <h3 className="text-sm font-bold text-[#1F3864] flex items-center gap-2 border-b border-gray-100 pb-2.5">
                        <MapPin size={15} className="text-[#FF9933]" />
                        Registered Land Parcel Specification
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">ULPIN / Parcel ID</span>
                          <span className="font-mono font-bold text-gray-800">UP-AGR-004821</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">Village / Tehsil</span>
                          <span className="font-medium text-gray-800">Ramnagar / Varanasi Sadar</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">Survey Plot Number</span>
                          <span className="font-medium text-gray-800">Plot No. 482 / Khatauni 190</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">Land Classification</span>
                          <span className="font-medium text-gray-800">Irrigated Agricultural (Double Crop)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">Total Area Affected</span>
                          <span className="font-bold text-green-700">0.85 Hectares</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-500">Acquiring Project</span>
                          <span className="font-medium text-[#1F3864]">Eastern Freight Connectivity Corridor</span>
                        </div>
                      </div>
                    </div>

                    {/* Compensation breakdown */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card space-y-3">
                      <h3 className="text-sm font-bold text-[#1F3864] flex items-center gap-2 border-b border-gray-100 pb-2.5">
                        <DollarSign size={15} className="text-green-600" />
                        Compensation Breakdown (RFCTLARR Act)
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">Determined Market Value</span>
                          <span className="font-semibold text-gray-800">₹21,00,000</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">Multiplier Factor (Rural)</span>
                          <span className="font-semibold text-gray-800">1.0x</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">Solatium (100% statutory)</span>
                          <span className="font-semibold text-green-700">+ ₹21,00,000</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500">Additional Interest</span>
                          <span className="font-semibold text-gray-800">Calculated at 12% p.a.</span>
                        </div>
                        <div className="flex justify-between py-1.5 bg-green-50 px-2 rounded-lg">
                          <span className="font-bold text-green-900">Total Final Award</span>
                          <span className="font-bold text-green-900 text-sm">₹42,00,000</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Link
                          href="/track-case/BS-UP-2026-004821"
                          className="w-full block text-center py-2 bg-[#1F3864] text-white text-xs font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors"
                        >
                          View Full Case File & Objection History →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notices" && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card">
                    <h3 className="text-sm font-bold text-[#1F3864] mb-3">Statutory Notifications Pertaining to Your Land</h3>
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-800 block">Section 11(1) Preliminary Notification</span>
                          <span className="text-gray-500 text-[11px]">Gazette Ref: UP-GAZ-2026-S11-042 · Issued by Government of Uttar Pradesh</span>
                        </div>
                        <Link href="/notifications" className="px-3 py-1.5 bg-blue-50 text-[#1F3864] rounded-lg font-semibold hover:bg-blue-100">Download PDF</Link>
                      </div>
                      <div className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-800 block">Section 15 Objection Hearing Order</span>
                          <span className="text-gray-500 text-[11px]">Issued by Office of District Collector, Varanasi · Disposal confirmed</span>
                        </div>
                        <Link href="/notifications" className="px-3 py-1.5 bg-blue-50 text-[#1F3864] rounded-lg font-semibold hover:bg-blue-100">Download PDF</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ADMINISTRATIVE DASHBOARD TABS (Ministry, State, District, LAO, PIA) */
              <>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                  {(["overview", "map", "charts"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                        activeTab === tab ? "bg-white text-[#1F3864] shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                      aria-pressed={activeTab === tab}
                    >
                      {tab === "overview"
                        ? role === "pia"
                          ? "Corridor Projects"
                          : role === "district"
                          ? "District Projects"
                          : role === "state"
                          ? "State Projects"
                          : role === "lao"
                          ? "Assigned Cases"
                          : "Projects Directory"
                        : tab === "map"
                        ? "GIS Spatial Map"
                        : "Analytics & Reports"}
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
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        {role === "district" ? "Area Notified vs Acquired (ha) — Varanasi Sectors" : "Area Notified vs Acquired by State (ha)"}
                      </h3>
                      <p className="text-[10px] text-gray-400 italic mb-3">Illustrative statutory data</p>
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
                      <p className="text-[10px] text-gray-400 italic mb-3">PFMS-DBT Switch Gateway Telemetry</p>
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
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Stage-wise Lifecycle Distribution</h3>
                      <p className="text-[10px] text-gray-400 italic mb-3">12 Statutory Stages across active pipeline</p>
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
                      <p className="text-[10px] text-gray-400 italic mb-3">Progress vs Target Milestones</p>
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
              </>
            )}
          </main>
        </div>
      </div>
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </ProtectedRoute>
  );
}
