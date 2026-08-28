"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, LayoutDashboard, Search } from "lucide-react";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#process", label: "Process Flow" },
  { href: "/dashboard", label: "Live Dashboard" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help & Feedback" },
];

function BhoomiSetuLogo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Geometric logo mark */}
      <div className="relative w-9 h-9 flex-shrink-0">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Land parcel shape */}
          <rect x="3" y="18" width="14" height="12" rx="1.5" fill="#1F3864" opacity="0.15" />
          <rect x="3" y="18" width="14" height="12" rx="1.5" stroke="#1F3864" strokeWidth="1.5" />
          {/* Location pin */}
          <circle cx="24" cy="12" r="4" fill="#FF9933" />
          <path d="M24 16 L24 22" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
          {/* Connected nodes */}
          <circle cx="10" cy="12" r="2" fill="#138808" />
          <path d="M12 12 L20 12" stroke="#1F3864" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M10 14 L10 18" stroke="#1F3864" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>
      {/* Wordmark */}
      <div>
        <div className="text-[#1F3864] font-bold text-lg leading-tight tracking-tight">BhoomiSetu</div>
        <div className="text-[9px] text-gray-500 uppercase tracking-widest font-medium leading-tight">भूमि सेतु</div>
      </div>
    </div>
  );
}

export default function MainNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm" role="banner">
      <div className="max-w-8xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" aria-label="BhoomiSetu Home">
          <BhoomiSetuLogo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#1F3864] bg-[#EAF0F8]"
                  : "text-gray-600 hover:text-[#1F3864] hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/track-case"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-[#138808] border border-[#138808] hover:bg-[#EAF7EE] transition-colors"
          >
            <Search size={14} />
            Track My Case
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#1F3864] text-white text-sm font-medium hover:bg-[#2A4A8A] transition-colors"
          >
            <LayoutDashboard size={14} />
            Login
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-1" role="navigation" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:text-[#1F3864] hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/track-case"
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-[#138808] border border-[#138808]"
              onClick={() => setMobileOpen(false)}
            >
              <Search size={14} /> Track My Case
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium bg-[#1F3864] text-white"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard size={14} /> Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
