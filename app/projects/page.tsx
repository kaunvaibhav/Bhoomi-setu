"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Filter, Plus, ArrowRight, MapPin, Building2,
  Calendar, Layers, CheckCircle, AlertTriangle, Clock,
  ArrowUpDown, Download,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import ToastNotification, { useToast } from "@/components/ToastNotification";
import { SAMPLE_PROJECTS, ProjectStatus, ProjectType } from "@/lib/mockData";
import { formatArea, formatCurrency } from "@/lib/utils";

export default function ProjectsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState<"updated" | "area" | "compensation">("updated");
  const { toasts, addToast, dismissToast } = useToast();

  const states = Array.from(new Set(SAMPLE_PROJECTS.map((p) => p.state)));
  const types = Array.from(new Set(SAMPLE_PROJECTS.map((p) => p.type)));

  const filteredProjects = SAMPLE_PROJECTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.requiringBody.toLowerCase().includes(searchQuery.toLowerCase());

    const matchState = selectedState === "all" || p.state === selectedState;
    const matchStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchType = selectedType === "all" || p.type === selectedType;

    return matchSearch && matchState && matchStatus && matchType;
  }).sort((a, b) => {
    if (sortBy === "area") return b.landRequired - a.landRequired;
    if (sortBy === "compensation") return b.compensationAssessed - a.compensationAssessed;
    return 0; // Default order
  });

  const handleExport = () => {
    addToast("info", "Generating projects summary report (CSV). Download starting...");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <TopUtilityBar />
      <MainNavbar />
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      <main id="main-content" className="flex-1 max-w-8xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/" className="hover:text-[#1F3864]">Home</Link>
              <span>/</span>
              <span className="text-[#1F3864] font-semibold">Infrastructure Projects</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F3864]">
              National Land Acquisition Projects Directory
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Comprehensive registry of active and notified national infrastructure projects across all 12 statutory acquisition stages.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors shadow-2xs"
            >
              <Download size={14} />
              Export Directory
            </button>
            <Link
              href="/projects/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1F3864] text-white rounded-xl text-xs font-semibold hover:bg-[#2A4A8A] transition-colors shadow-xs"
            >
              <Plus size={15} />
              Submit New Proposal
            </Link>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <p className="text-xs text-gray-500 font-medium">Total Active Projects</p>
            <p className="text-xl font-bold text-[#1F3864] mt-1">{SAMPLE_PROJECTS.length}</p>
            <p className="text-[10px] text-green-600 font-semibold mt-0.5">Across 5 States</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <p className="text-xs text-gray-500 font-medium">Total Land Notified</p>
            <p className="text-xl font-bold text-[#1F3864] mt-1">
              {formatArea(SAMPLE_PROJECTS.reduce((acc, curr) => acc + curr.landNotified, 0))}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">Under Section 11/19</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <p className="text-xs text-gray-500 font-medium">Total Disbursed (PFMS)</p>
            <p className="text-xl font-bold text-[#138808] mt-1">
              {formatCurrency(SAMPLE_PROJECTS.reduce((acc, curr) => acc + curr.compensationDisbursed, 0), "cr")}
            </p>
            <p className="text-[10px] text-green-700 mt-0.5">Direct Benefit Transfers</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <p className="text-xs text-gray-500 font-medium">Affected Families</p>
            <p className="text-xl font-bold text-[#1F3864] mt-1">
              {SAMPLE_PROJECTS.reduce((acc, curr) => acc + curr.affectedFamilies, 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-blue-600 mt-0.5">100% R&R Mapped</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by project name, ID (e.g. PROJ-UP-001), district, or agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864]/20 focus:border-[#1F3864]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
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
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
              >
                <option value="all">All Sectors</option>
                {types.map((tp) => (
                  <option key={tp} value={tp}>{tp}</option>
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
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
              >
                <option value="updated">Recently Updated</option>
                <option value="area">Highest Land Area</option>
                <option value="compensation">Highest Compensation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-[#1F3864]/40 hover:shadow-md transition-all flex flex-col justify-between p-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-gray-400 font-mono">{project.id}</span>
                  <StatusBadge status={project.status} size="sm" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#1F3864] group-hover:text-blue-700 transition-colors line-clamp-1">
                    {project.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <MapPin size={13} className="text-gray-400" />
                    <span>{project.district}, {project.state}</span>
                  </div>
                </div>

                <div className="bg-[#EAF0F8]/50 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-[11px]">Agency:</span>
                    <span className="font-semibold text-gray-800 truncate max-w-[170px]" title={project.requiringBody}>
                      {project.requiringBody}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-[11px]">Lifecycle Stage:</span>
                    <span className="font-bold text-[#1F3864]">Stage {project.currentStage} of 12</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Possession Handover</span>
                    <span className="font-bold text-[#1F3864]">{project.possessionPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${project.possessionPercent}%`,
                        backgroundColor: project.possessionPercent > 70 ? "#138808" : project.possessionPercent > 40 ? "#1F3864" : "#E85D04",
                      }}
                    />
                  </div>
                </div>

                {/* Land and Budget Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Land Required</span>
                    <span className="font-bold text-gray-800">{formatArea(project.landRequired)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Assessed Compensation</span>
                    <span className="font-bold text-[#138808]">{formatCurrency(project.compensationAssessed, "cr")}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  Updated: {project.lastUpdated.split(",")[0]}
                </span>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-[#1F3864] hover:text-blue-700 transition-colors"
                >
                  View Details
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <AlertTriangle size={36} className="mx-auto text-amber-500 mb-2" />
            <h2 className="text-base font-bold text-gray-700">No matching projects found</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try modifying your search keywords or resetting your state and sector filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedState("all");
                setSelectedType("all");
                setSelectedStatus("all");
              }}
              className="mt-4 px-4 py-2 bg-[#1F3864] text-white rounded-xl text-xs font-semibold hover:bg-[#2A4A8A]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
