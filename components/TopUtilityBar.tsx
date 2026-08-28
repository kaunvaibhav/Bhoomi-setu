"use client";

import Link from "next/link";
import { Globe, Map, Accessibility, Volume2, HelpCircle, ChevronRight } from "lucide-react";

export default function TopUtilityBar() {
  return (
    <div className="no-print">
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Tricolor strip */}
      <div className="tricolor-strip" aria-hidden="true" />

      {/* Utility bar */}
      <div className="bg-white border-b border-gray-100 py-1.5 px-4">
        <div className="max-w-8xl mx-auto flex items-center justify-between gap-4">
          {/* Left: GoI Identity */}
          <div className="flex items-center gap-3">
            {/* Emblem placeholder */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1F3864] flex items-center justify-center" aria-label="Government of India emblem placeholder">
              <span className="text-white text-xs font-bold leading-none">GoI</span>
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-medium text-[#1F3864]" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>भारत सरकार</div>
              <div className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Government of India</div>
            </div>
          </div>

          {/* Center: Ministry name */}
          <div className="hidden md:block text-center leading-tight">
            <div className="text-[10px] font-medium text-gray-500 tracking-wide uppercase">Ministry of Rural Development</div>
            <div className="text-[11px] font-semibold text-[#1F3864]" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              ग्रामीण विकास मंत्रालय
            </div>
          </div>

          {/* Right: Utility icons */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Site map"
              className="p-1.5 rounded text-gray-500 hover:text-[#1F3864] hover:bg-gray-100 transition-colors"
            >
              <Map size={13} />
            </button>
            <button
              aria-label="Change language"
              className="px-2 py-1 rounded text-[10px] font-medium text-gray-500 hover:text-[#1F3864] hover:bg-gray-100 transition-colors border border-gray-200"
            >
              हिंदी / EN
            </button>
            <button
              aria-label="Accessibility options"
              className="p-1.5 rounded text-gray-500 hover:text-[#1F3864] hover:bg-gray-100 transition-colors"
            >
              <Accessibility size={13} />
            </button>
            <button
              aria-label="Screen reader support"
              className="p-1.5 rounded text-gray-500 hover:text-[#1F3864] hover:bg-gray-100 transition-colors"
            >
              <Volume2 size={13} />
            </button>
            <Link
              href="/help"
              aria-label="Help"
              className="p-1.5 rounded text-gray-500 hover:text-[#1F3864] hover:bg-gray-100 transition-colors"
            >
              <HelpCircle size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
