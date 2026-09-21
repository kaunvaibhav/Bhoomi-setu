"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Search, Filter, Download, ArrowRight, Brain, AlertTriangle,
  CheckCircle, Shield, FileText, Eye, Compass, LogOut, RefreshCw,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Modal from "@/components/Modal";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { useAuth } from "@/context/AuthContext";
import { SAMPLE_PROJECTS, Parcel, UserRole, DEMO_ROLES } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export default function DashboardParcelsPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const effectiveRole = role === "field" ? "lao" : role;

  // Flatten and scope parcels based on authenticated role
  const allParcels: (Parcel & { projectName: string; projectId: string; state: string; requiringBody: string })[] = SAMPLE_PROJECTS.flatMap((proj) =>
    proj.parcels.map((p) => ({
      ...p,
      projectName: proj.name,
      projectId: proj.id,
      state: proj.state,
      requiringBody: proj.requiringBody,
    }))
  ).filter((p) => {
    if (effectiveRole === "citizen") {
      // Citizen constraint: strictly their own registered parcel only
      return p.id === "UP-AGR-004821" || (user?.name && p.ownerName.toLowerCase().includes("patel"));
    }
    if (effectiveRole === "district") {
      return p.district === "Varanasi";
    }
    if (effectiveRole === "state") {
      return p.state === "Uttar Pradesh";
    }
    if (effectiveRole === "pia") {
      return p.requiringBody === "National Highways Authority of India";
    }
    if (effectiveRole === "lao") {
      return p.district === "Varanasi";
    }
    return true; // Ministry sees all nationwide
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterFlagged, setFilterFlagged] = useState<"all" | "flagged" | "normal">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedParcel, setSelectedParcel] = useState<(Parcel & { projectName: string; projectId: string; state: string; requiringBody: string }) | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("success", "Land parcel database synchronized with State Revenue Registries (DILRMP)");
    }, 600);
  };

  const handleExportGeoJSON = () => {
    addToast("info", "Generating spatial GeoJSON polygon export package...");
  };

  const filteredParcels = allParcels.filter((p) => {
    const matchSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchFlag =
      filterFlagged === "all" ? true : filterFlagged === "flagged" ? p.flagged : !p.flagged;

    const matchStatus =
      filterStatus === "all" ? true : p.status === filterStatus;

    return matchSearch && matchFlag && matchStatus;
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
              <span className="text-sm font-semibold text-[#1F3864]">Land Parcels Registry</span>
            </div>

            
          </div>
        </div>

        {/* Layout */}
        <div className="flex">
          <div className="hidden lg:block">
            <DashboardSidebar currentRole={role} />
          </div>

          <main id="main-content" className="flex-1 min-w-0 p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <h1 className="text-xl font-bold text-[#1F3864]">Land Parcel Registry & Spatial Mapping</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  14-Digit ULPIN verified revenue plots with AI valuation scrutiny and GIS boundaries.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                  Sync DILRMP
                </button>
                <button
                  onClick={handleExportGeoJSON}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <Download size={13} />
                  Export GeoJSON
                </button>
                <Link
                  href="/dashboard/field-survey"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#138808] text-white rounded-xl text-xs font-semibold hover:bg-[#0E5F05] transition-colors shadow-xs"
                >
                  <Compass size={14} />
                  Field Survey Tool
                </Link>
              </div>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Mapped Parcels</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">{allParcels.length}</p>
                <p className="text-[10px] text-green-600 font-semibold mt-0.5">100% ULPIN Indexed</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Flagged by AI</p>
                <p className="text-xl font-bold text-red-600 mt-1">
                  {allParcels.filter((p) => p.flagged).length}
                </p>
                <p className="text-[10px] text-red-500 mt-0.5">Anomaly Score &gt; 50</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Compensated / Acquired</p>
                <p className="text-xl font-bold text-[#138808] mt-1">
                  {allParcels.filter((p) => p.status === "compensated" || p.status === "acquired").length}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Possession handover ready</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <p className="text-xs text-gray-500 font-medium">Total Area Mapped</p>
                <p className="text-xl font-bold text-[#1F3864] mt-1">
                  {(allParcels.reduce((acc, curr) => acc + curr.area, 0) / 10000).toFixed(2)} Ha
                </p>
                <p className="text-[10px] text-blue-600 mt-0.5">Spatial Polygons</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by ULPIN, Parcel ID, Owner Name, or Village..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F3864]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterFlagged}
                  onChange={(e) => setFilterFlagged(e.target.value as any)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All Valuation Statuses</option>
                  <option value="flagged">AI Flagged Only</option>
                  <option value="normal">Normal / Clean</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="all">All Parcel Statuses</option>
                  <option value="pending">Pending Award</option>
                  <option value="compensated">Compensated</option>
                  <option value="acquired">Acquired</option>
                  <option value="disputed">Disputed</option>
                </select>
              </div>
            </div>

            {/* Parcels Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 pl-4">Parcel & ULPIN</th>
                      <th className="p-3.5">Owner & Village</th>
                      <th className="p-3.5">Land Type / Area</th>
                      <th className="p-3.5">Declared Value</th>
                      <th className="p-3.5">Expected AI Range</th>
                      <th className="p-3.5">AI Flag</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredParcels.map((parcel) => (
                      <tr key={parcel.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3.5 pl-4">
                          <span className="font-bold text-[#1F3864] block">{parcel.id}</span>
                          <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            ULPIN: {parcel.ulpin}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-800 block">{parcel.ownerName}</span>
                          <span className="text-[11px] text-gray-500">
                            {parcel.village}, {parcel.district}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-gray-700 font-medium block">{parcel.landType}</span>
                          <span className="text-[10px] text-gray-400">
                            {(parcel.area / 10000).toFixed(2)} Ha ({parcel.area.toLocaleString()} m²)
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-gray-800">
                          {formatCurrency(parcel.declaredValue)}
                        </td>
                        <td className="p-3.5 text-gray-600 font-medium">
                          {formatCurrency(parcel.expectedRangeLow)} - {formatCurrency(parcel.expectedRangeHigh)}
                        </td>
                        <td className="p-3.5">
                          {parcel.flagged ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                              <AlertTriangle size={11} /> Flagged ({parcel.anomalyScore})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                              <CheckCircle size={11} /> Clean ({parcel.anomalyScore})
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                              parcel.status === "compensated"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : parcel.status === "acquired"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {parcel.status}
                          </span>
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <button
                            onClick={() => setSelectedParcel(parcel)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-[#1F3864] hover:bg-[#EAF0F8] rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Eye size={12} />
                            <span>Inspect</span>
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

        {/* Parcel Inspection Modal */}
        <Modal
          isOpen={!!selectedParcel}
          onClose={() => setSelectedParcel(null)}
          title={`Parcel Inspector — ${selectedParcel?.id}`}
          size="lg"
        >
          {selectedParcel && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#EAF0F8] border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">ULPIN (Unique Land Parcel Identifier)</span>
                  <p className="text-sm font-mono font-bold text-[#1F3864]">{selectedParcel.ulpin}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Associated Project</span>
                  <p className="text-xs font-semibold text-[#1F3864]">{selectedParcel.projectName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-semibold">Registered Owner</span>
                  <span className="font-bold text-gray-800">{selectedParcel.ownerName}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-semibold">Village / District</span>
                  <span className="font-bold text-gray-800">{selectedParcel.village}, {selectedParcel.district}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-semibold">Land Category</span>
                  <span className="font-bold text-gray-800">{selectedParcel.landType} ({selectedParcel.irrigationStatus})</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-semibold">Total Area</span>
                  <span className="font-bold text-gray-800">{(selectedParcel.area / 10000).toFixed(3)} Ha ({selectedParcel.area} m²)</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-semibold">Declared Compensation</span>
                  <span className="font-bold text-[#1F3864]">{formatCurrency(selectedParcel.declaredValue)}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 block font-semibold">Expected ML Range</span>
                  <span className="font-bold text-green-700">{formatCurrency(selectedParcel.expectedRangeLow)} - {formatCurrency(selectedParcel.expectedRangeHigh)}</span>
                </div>
              </div>

              {selectedParcel.flagged && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-red-700 font-bold">
                    <AlertTriangle size={14} />
                    <span>AI Valuation Flag — Anomaly Score: {selectedParcel.anomalyScore}/100</span>
                  </div>
                  <p className="text-gray-600 text-[11px]">
                    Declared compensation deviates by &gt; 25% from comparable transactions within a 2.5km radius. Formal Collector review recommended before award finalisation.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <Link
                  href={`/projects/${selectedParcel.projectId}`}
                  className="px-3.5 py-2 bg-gray-100 text-[#1F3864] rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  View Parent Project
                </Link>
                <Link
                  href="/valuation-review"
                  className="px-4 py-2 bg-[#1F3864] text-white rounded-xl text-xs font-semibold hover:bg-[#2A4A8A] transition-colors"
                >
                  Open AI Valuation Audit
                </Link>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
