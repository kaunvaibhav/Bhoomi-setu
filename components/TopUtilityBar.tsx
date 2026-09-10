"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Map, Accessibility, Volume2, HelpCircle, ChevronRight, Check } from "lucide-react";

export default function TopUtilityBar() {
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const [highContrast, setHighContrast] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const toggleLanguage = () => {
    const nextLang = lang === "EN" ? "HI" : "EN";
    setLang(nextLang);
  };

  const toggleAccessibility = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add("contrast-more");
    } else {
      document.documentElement.classList.remove("contrast-more");
    }
  };

  const toggleAudio = () => {
    setAudioActive(!audioActive);
    if (!audioActive && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("Welcome to BhoomiSetu. National Land Acquisition and Management System.");
      utterance.lang = lang === "EN" ? "en-IN" : "hi-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

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
            {/* Emblem logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
              alt="State Emblem of India"
              className="flex-shrink-0 w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="leading-tight">
              <div className="text-[11px] font-medium text-[#1F3864]" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>भारत सरकार</div>
              <div className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Government of India</div>
            </div>
          </div>

          {/* Center: Ministry & Department name */}
          <div className="hidden md:block text-center leading-tight">
            <div className="text-[10px] font-medium text-gray-500 tracking-wide uppercase">
              Ministry of Rural Development &nbsp;|&nbsp; Department of Land Resources (DoLR)
            </div>
            <div className="text-[11px] font-semibold text-[#1F3864]" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              ग्रामीण विकास मंत्रालय &nbsp;|&nbsp; भूमि संसाधन विभाग
            </div>
          </div>

          {/* Right: Utility icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowMapModal(true)}
              aria-label="Site map"
              title="Site Map & Quick Links"
              className="p-1.5 rounded text-gray-500 hover:text-[#1F3864] hover:bg-gray-100 transition-colors"
            >
              <Map size={13} />
            </button>
            <button
              onClick={toggleLanguage}
              aria-label="Change language"
              title={`Active language: ${lang}. Click to switch.`}
              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors border ${
                lang === "HI"
                  ? "bg-[#1F3864] text-white border-[#1F3864]"
                  : "text-gray-600 hover:text-[#1F3864] hover:bg-gray-100 border-gray-200"
              }`}
            >
              {lang === "EN" ? "हिंदी / EN" : "English / हिंदी"}
            </button>
            <button
              onClick={toggleAccessibility}
              aria-label="Accessibility options"
              title="Toggle Enhanced Contrast & Accessibility"
              className={`p-1.5 rounded transition-colors ${
                highContrast ? "bg-amber-100 text-amber-900" : "text-gray-500 hover:text-[#1F3864] hover:bg-gray-100"
              }`}
            >
              <Accessibility size={13} />
            </button>
            <button
              onClick={toggleAudio}
              aria-label="Screen reader support"
              title="Screen Reader Voice Announcement"
              className={`p-1.5 rounded transition-colors ${
                audioActive ? "bg-green-100 text-green-800" : "text-gray-500 hover:text-[#1F3864] hover:bg-gray-100"
              }`}
            >
              <Volume2 size={13} />
            </button>
            <Link
              href="/help"
              aria-label="Help"
              title="Help & Support Desk"
              className="p-1.5 rounded text-gray-500 hover:text-[#1F3864] hover:bg-gray-100 transition-colors"
            >
              <HelpCircle size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Sitemap Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#1F3864]">BhoomiSetu National Portal Sitemap</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-[#1F3864] mb-2 uppercase text-[10px] tracking-wider">Public Portals</p>
                <ul className="space-y-1.5 text-gray-600">
                  <li><Link href="/" onClick={() => setShowMapModal(false)} className="hover:underline">Home Portal</Link></li>
                  <li><Link href="/projects" onClick={() => setShowMapModal(false)} className="hover:underline">Projects Directory</Link></li>
                  <li><Link href="/track-case" onClick={() => setShowMapModal(false)} className="hover:underline">Track Citizen Case</Link></li>
                  <li><Link href="/notifications" onClick={() => setShowMapModal(false)} className="hover:underline">Section 11 Notices</Link></li>
                  <li><Link href="/about" onClick={() => setShowMapModal(false)} className="hover:underline">System Architecture</Link></li>
                  <li><Link href="/help" onClick={() => setShowMapModal(false)} className="hover:underline">Help & Support Desk</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-[#1F3864] mb-2 uppercase text-[10px] tracking-wider">Officer Workbenches</p>
                <ul className="space-y-1.5 text-gray-600">
                  <li><Link href="/dashboard" onClick={() => setShowMapModal(false)} className="hover:underline">Live National Dashboard</Link></li>
                  <li><Link href="/dashboard/projects" onClick={() => setShowMapModal(false)} className="hover:underline">Projects Manager</Link></li>
                  <li><Link href="/dashboard/parcels" onClick={() => setShowMapModal(false)} className="hover:underline">Land Parcels Registry</Link></li>
                  <li><Link href="/dashboard/compensation" onClick={() => setShowMapModal(false)} className="hover:underline">PFMS Compensation</Link></li>
                  <li><Link href="/dashboard/rnr" onClick={() => setShowMapModal(false)} className="hover:underline">R&R Welfare Tracker</Link></li>
                  <li><Link href="/valuation-review" onClick={() => setShowMapModal(false)} className="hover:underline">AI Valuation Review</Link></li>
                  <li><Link href="/dashboard/documents" onClick={() => setShowMapModal(false)} className="hover:underline">Gazette Vault</Link></li>
                  <li><Link href="/dashboard/reports" onClick={() => setShowMapModal(false)} className="hover:underline">Executive MIS Reports</Link></li>
                  <li><Link href="/dashboard/alerts" onClick={() => setShowMapModal(false)} className="hover:underline">Alerts & Escalations</Link></li>
                  <li><Link href="/dashboard/audit" onClick={() => setShowMapModal(false)} className="hover:underline">Immutable Audit Trail</Link></li>
                  <li><Link href="/dashboard/field-survey" onClick={() => setShowMapModal(false)} className="hover:underline">Field Survey PWA</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
