"use client";

import TopUtilityBar from "@/components/TopUtilityBar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectTable from "@/components/ProjectTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { type UserRole, SAMPLE_PROJECTS } from "@/lib/mockData";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { DEMO_ROLES } from "@/lib/mockData";

export default function ProjectsPage() {
  const { user, logout } = useAuth();
  const role: UserRole = (user?.role as UserRole) || "ministry";
  const roleConfig = DEMO_ROLES[role] || DEMO_ROLES.ministry;

  const projects = role === "district"
    ? SAMPLE_PROJECTS.filter((p) => p.state === "Uttar Pradesh")
    : role === "pia"
    ? SAMPLE_PROJECTS.filter((p) => p.requiringBody === "National Highways Authority of India")
    : SAMPLE_PROJECTS;

  return (
    <ProtectedRoute>
      <TopUtilityBar />
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-[#1F3864] font-bold text-lg">BhoomiSetu</Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-600">Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
                title="Sign out of BhoomiSetu"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="hidden lg:block">
            <DashboardSidebar currentRole={role} />
          </div>

          <main className="flex-1 min-w-0 p-5 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold text-[#1F3864]">All Projects</h1>
            </div>
            <ProjectTable projects={projects} isLoading={false} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
