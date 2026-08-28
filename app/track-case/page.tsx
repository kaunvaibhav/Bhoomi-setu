"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Shield, AlertCircle } from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";
import ToastNotification, { useToast } from "@/components/ToastNotification";

export default function TrackCasePage() {
  const [caseId, setCaseId] = useState("");
  const [mobile, setMobile] = useState("");
  const [tab, setTab] = useState<"caseid" | "mobile">("caseid");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = tab === "caseid" ? caseId.trim() : mobile.trim();
    if (!query) return;

    setLoading(true);
    setNotFound(false);

    setTimeout(() => {
      setLoading(false);
      const normalized = query.toUpperCase().replace(/\s/g, "");
      if (normalized === "BS-UP-2026-004821" || normalized === "BSUP2026004821") {
        window.location.href = "/track-case/BS-UP-2026-004821";
      } else {
        setNotFound(true);
      }
    }, 800);
  }

  return (
    <>
      <TopUtilityBar />
      <MainNavbar />
      <main id="main-content" className="min-h-screen bg-[#EAF0F8] py-12 px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold text-[#1F3864] uppercase tracking-wider border border-[#1F3864]/20 bg-white px-3 py-1 rounded-full mb-4">
              Citizen Service
            </span>
            <h1 className="text-3xl font-bold text-[#1F3864] mb-2">Track My Land Acquisition Case</h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              View the current status of your case, compensation details, available documents, and rehabilitation support.
            </p>
          </div>

          {/* Lookup card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-0 bg-gray-50 border-b border-gray-200">
              <button
                onClick={() => setTab("caseid")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "caseid" ? "bg-white text-[#1F3864] border-b-2 border-[#1F3864]" : "text-gray-500 hover:text-gray-700"}`}
                aria-pressed={tab === "caseid"}
              >
                Case ID
              </button>
              <button
                onClick={() => setTab("mobile")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "mobile" ? "bg-white text-[#1F3864] border-b-2 border-[#1F3864]" : "text-gray-500 hover:text-gray-700"}`}
                aria-pressed={tab === "mobile"}
              >
                Mobile / Aadhaar-linked Login
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSearch} noValidate>
                {tab === "caseid" ? (
                  <div className="mb-4">
                    <label htmlFor="case-id-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter your Case ID
                    </label>
                    <input
                      id="case-id-input"
                      type="text"
                      value={caseId}
                      onChange={(e) => setCaseId(e.target.value)}
                      placeholder="e.g. BS-UP-2026-004821"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50 font-mono"
                      aria-describedby="case-id-hint"
                      autoComplete="off"
                    />
                    <p id="case-id-hint" className="text-xs text-gray-400 mt-1.5">
                      Your Case ID is in the format BS-[State]-[Year]-[Number]
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label htmlFor="mobile-input" className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      id="mobile-input"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter registered mobile number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50"
                      aria-describedby="mobile-hint"
                      autoComplete="tel"
                    />
                    <p id="mobile-hint" className="text-xs text-gray-400 mt-1.5">
                      OTP will be sent to this number for identity verification.
                    </p>
                  </div>
                )}

                {/* Privacy notice */}
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 mb-4">
                  <Shield size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Do not enter Aadhaar number or other sensitive information in this demonstration environment. This is a prototype for Smart India Hackathon 2026.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1F3864] text-white font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search size={16} />
                      View Case Status
                    </>
                  )}
                </button>
              </form>

              {/* Not found */}
              {notFound && (
                <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Case not found</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      No record found for the entered ID. Please check and try again.
                      <br />
                      <strong>Demo:</strong> Try case ID <code className="bg-red-100 px-1 rounded">BS-UP-2026-004821</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Demo hint */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-700 font-medium mb-1">Prototype Demo Hint</p>
            <p className="text-xs text-amber-600">
              Use Case ID: <strong>BS-UP-2026-004821</strong> to view a sample land acquisition case with full lifecycle timeline and compensation status.
            </p>
            <button
              onClick={() => { setCaseId("BS-UP-2026-004821"); setTab("caseid"); }}
              className="mt-2 text-xs font-semibold text-amber-700 underline"
            >
              Fill sample Case ID →
            </button>
          </div>

          {/* Help section */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-[#1F3864] mb-1">What can you track?</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li className="flex items-center gap-1.5">• Current lifecycle stage</li>
                <li className="flex items-center gap-1.5">• Compensation status</li>
                <li className="flex items-center gap-1.5">• Available documents</li>
                <li className="flex items-center gap-1.5">• Objection & grievance status</li>
                <li className="flex items-center gap-1.5">• R&R entitlements</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-[#1F3864] mb-1">Need help?</p>
              <p className="text-xs text-gray-500 mb-3">If you don't know your Case ID, contact your district Land Acquisition Office.</p>
              <Link href="/help" className="flex items-center gap-1 text-xs font-semibold text-[#1F3864] hover:underline">
                Help & Support <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
