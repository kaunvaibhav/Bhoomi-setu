"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, MapPin, DollarSign, Users,
  Brain, FileText, BarChart3, Bell, ClipboardList, HelpCircle,
  ChevronRight, Shield,
} from "lucide-react";
import { type UserRole, DEMO_ROLES } from "@/lib/mockData";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { href: "/dashboard/projects", label: "Projects", icon: <FolderOpen size={16} /> },
  { href: "/dashboard/parcels", label: "Land Parcels", icon: <MapPin size={16} /> },
  { href: "/dashboard/compensation", label: "Compensation", icon: <DollarSign size={16} /> },
  { href: "/dashboard/rnr", label: "R&R Tracker", icon: <Users size={16} /> },
  { href: "/valuation-review", label: "Valuation Review", icon: <Brain size={16} />, badge: 38 },
  { href: "/dashboard/documents", label: "Documents", icon: <FileText size={16} /> },
  { href: "/dashboard/reports", label: "Reports", icon: <BarChart3 size={16} /> },
  { href: "/dashboard/alerts", label: "Alerts", icon: <Bell size={16} />, badge: 4 },
  { href: "/dashboard/audit", label: "Audit Trail", icon: <ClipboardList size={16} /> },
  { href: "/help", label: "Help", icon: <HelpCircle size={16} /> },
];

interface DashboardSidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function DashboardSidebar({ currentRole, onRoleChange }: DashboardSidebarProps) {
  const pathname = usePathname();
  const roleConfig = DEMO_ROLES[currentRole];

  return (
    <aside
      className="w-60 bg-white border-r border-gray-200 flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      aria-label="Dashboard navigation"
    >
      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-0.5" aria-label="Sidebar">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-1.5">Navigation</p>
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? "bg-[#EAF0F8] text-[#1F3864]"
                  : "text-gray-600 hover:text-[#1F3864] hover:bg-gray-50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex items-center gap-2.5">
                <span className={isActive ? "text-[#1F3864]" : "text-gray-400 group-hover:text-[#1F3864]"}>
                  {item.icon}
                </span>
                {item.label}
              </span>
              {item.badge && (
                <span className="bg-[#FF9933] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role switcher */}
      <div className="p-3 border-t border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">Demo Role</p>
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864]"
          aria-label="Switch demo role"
        >
          <option value="ministry">Ministry Analyst</option>
          <option value="state">State Govt Officer</option>
          <option value="district">District Collector</option>
          <option value="pia">PIA Officer</option>
          <option value="field">Field Officer</option>
          <option value="citizen">Citizen</option>
        </select>
        <div className="mt-2 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-[11px] font-semibold text-gray-700 truncate">{roleConfig.label}</p>
          <p className="text-[10px] text-gray-500 truncate">{roleConfig.description}</p>
          <div className="flex items-center gap-1 mt-1">
            <Shield size={9} className="text-gray-400" />
            <span className="text-[9px] text-gray-400">Prototype demo access</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
