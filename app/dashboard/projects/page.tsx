"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderOpen, Plus, Search, Filter, Download, ArrowRight,
  MapPin, CheckCircle, AlertTriangle, Clock, RefreshCw, LogOut,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import { SAMPLE_PROJECTS, UserRole, DEMO_ROLES } from "@/lib/mockData";
import { formatArea, formatCurrency } from "@/lib/utils";

export default function DashboardProjectsPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("success", "Projects directory refreshed with latest field data");
    }, 600);
  };

  const handleExport = () => {
    addToast("info", "Generating projects MIS export report (Excel/CSV)...");
  };

  const states = Array.from(new Set(SAMPLE_PROJECTS.map((p) => p.state)));

  const filteredProjects = SAMPLE_PROJECTS.filter((p) => {
    const matchRole =
      role === "district"
        ? p.state === "Uttar Pradesh"
        : role === "pia"
        ? p.requiringBody === "National Highways Authority of India"
        : true;

    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchState = selectedState === "all" || p.state === selectedState;
    const matchStatus = selectedStatus === "all" || p.status === selectedStatus;

    return matchRole && matchSearch && matchState && matchStatus;
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
              <span className="text-sm font-semibold text-[#1F3864]">Projects Directory</span>
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
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1F3864] flex items-center justify-center">
                    <FolderOpen size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">Infrastructure Projects Management</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Active land acquisition projects under statutory execution ({filteredProjects.length} projects displayed)
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
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <Download size={13} />
                  Export MIS
                </button>
                <Link
                  href="/projects/new"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1F3864] text-white rounded-xl text-xs font-semibold hover:bg-[#2A4A8A] transition-colors shadow-xs"
                >
                  <Plus size={14} />
                  New Proposal
                </Link>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Filter by project name, ID, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All States</option>
                  {states.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="on-track">On Track</option>
                  <option value="in-progress">In Progress</option>
                  <option value="at-risk">At Risk</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>

            {/* Table view */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 pl-4">Project Details</th>
                      <th className="p-3.5">Agency</th>
                      <th className="p-3.5">Stage</th>
                      <th className="p-3.5">Land Req. / Acquired</th>
                      <th className="p-3.5">Compensation</th>
                      <th className="p-3.5">Possession</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="p-3.5 pl-4">
                          <span className="text-[10px] font-mono text-gray-400 block">{p.id}</span>
                          <Link href={`/projects/${p.id}`} className="font-bold text-[#1F3864] hover:underline text-xs line-clamp-1">
                            {p.name}
                          </Link>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-gray-400" />
                            {p.district}, {p.state}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-700 font-medium">
                          {p.requiringBody}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-[#EAF0F8] text-[#1F3864] rounded-md font-semibold text-[10px]">
                            Stage {p.currentStage}/12
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-gray-800">{formatArea(p.landAcquired)}</span>
                          <span className="text-gray-400 block text-[10px]">of {formatArea(p.landRequired)}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-[#138808]">{formatCurrency(p.compensationDisbursed, "cr")}</span>
                          <span className="text-gray-400 block text-[10px]">of {formatCurrency(p.compensationAssessed, "cr")}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#138808] rounded-full"
                                style={{ width: `${p.possessionPercent}%` }}
                              />
                            </div>
                            <span className="font-bold text-gray-700 text-[11px]">{p.possessionPercent}%</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <StatusBadge status={p.status} size="sm" />
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <Link
                            href={`/projects/${p.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#1F3864] text-white rounded-lg text-xs font-semibold hover:bg-[#2A4A8A] transition-colors"
                          >
                            <span>Open</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
