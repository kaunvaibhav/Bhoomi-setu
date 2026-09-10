"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, MapPin, DollarSign, Users,
  Brain, FileText, BarChart3, Bell, ClipboardList, HelpCircle,
  ChevronRight, Shield, LogOut, Compass,
} from "lucide-react";
import { type UserRole, DEMO_ROLES } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  allowedRoles?: UserRole[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { href: "/dashboard/projects", label: "Projects", icon: <FolderOpen size={16} /> },
  { href: "/dashboard/parcels", label: "Land Parcels", icon: <MapPin size={16} /> },
  { href: "/dashboard/field-survey", label: "Field Survey PWA", icon: <Compass size={16} /> },
  { href: "/dashboard/compensation", label: "Compensation", icon: <DollarSign size={16} /> },
  { href: "/dashboard/rnr", label: "R&R Tracker", icon: <Users size={16} /> },
  { href: "/valuation-review", label: "Valuation Review", icon: <Brain size={16} />, badge: 38, allowedRoles: ["ministry", "state", "district"] },
  { href: "/dashboard/documents", label: "Documents", icon: <FileText size={16} /> },
  { href: "/dashboard/reports", label: "Reports", icon: <BarChart3 size={16} />, allowedRoles: ["ministry", "state"] },
  { href: "/dashboard/alerts", label: "Alerts", icon: <Bell size={16} />, badge: 4 },
  { href: "/dashboard/audit", label: "Audit Trail", icon: <ClipboardList size={16} />, allowedRoles: ["ministry"] },
  { href: "/help", label: "Help", icon: <HelpCircle size={16} /> },
];

interface DashboardSidebarProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onClose?: () => void;
}

export default function DashboardSidebar({ currentRole, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const roleConfig = DEMO_ROLES[currentRole] || DEMO_ROLES.ministry;

  return (
    <aside
      className="w-60 bg-white border-r border-gray-200 flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
      aria-label="Dashboard navigation"
    >
      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-0.5" aria-label="Sidebar">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-1.5">Navigation</p>
        {SIDEBAR_ITEMS.filter((item) => !item.allowedRoles || item.allowedRoles.includes(currentRole)).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
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

      {/* Authenticated User Session & Logout */}
      <div className="p-3 border-t border-gray-100 bg-slate-50/50">
        <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: roleConfig.color }}
            >
              {user?.avatarInitials || roleConfig.label[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1F3864] truncate">
                {user?.name || roleConfig.label}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {user?.roleTitle || roleConfig.label}
              </p>
            </div>
          </div>
          <p className="text-[9.5px] text-gray-400 leading-tight mb-2.5 truncate">
            {user?.department || roleConfig.description}
          </p>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
            title="Sign out of BhoomiSetu"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

