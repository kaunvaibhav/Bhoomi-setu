"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, Lock, ArrowRight, LayoutDashboard, User, Building2, HardHat, Cpu, UserCheck } from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import Footer from "@/components/Footer";
import { type UserRole } from "@/lib/mockData";

const DEMO_ROLES: { role: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  { role: "ministry", label: "Ministry Analyst", icon: <LayoutDashboard size={16} />, color: "#1F3864", desc: "National overview & policy analytics" },
  { role: "district", label: "District Collector", icon: <HardHat size={16} />, color: "#0369A1", desc: "Case processing & local coordination" },
  { role: "pia", label: "PIA Officer", icon: <Cpu size={16} />, color: "#065F46", desc: "Proposal submission & tracking" },
  { role: "citizen", label: "Citizen / Land Owner", icon: <User size={16} />, color: "#138808", desc: "Case status & compensation" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("ministry");
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);

  function handleDemoAccess(demoRole: UserRole) {
    setLoading(true);
    setTimeout(() => {
      if (demoRole === "citizen") {
        router.push("/track-case");
      } else {
        router.push("/dashboard");
      }
    }, 800);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleDemoAccess(role);
  }

  return (
    <>
      <TopUtilityBar />
      <div className="min-h-screen bg-[#EAF0F8] flex flex-col">
        <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-4">
                <div className="text-2xl font-bold text-[#1F3864]">BhoomiSetu</div>
                <div className="text-xs text-gray-500">भूमि सेतु</div>
              </Link>
              <h1 className="text-2xl font-bold text-[#1F3864] mb-1">Sign in to BhoomiSetu</h1>
              <p className="text-sm text-gray-500">Government of India · Department of Land Resources</p>
            </div>

            {/* Login card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card-lg overflow-hidden">
              {/* Prototype banner */}
              <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2">
                <Shield size={14} className="text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  <strong>Prototype demo environment.</strong> No real authentication. Use demo access buttons below.
                </p>
              </div>

              <div className="p-6">
                {/* Tabs */}
                <div className="flex gap-0 bg-gray-100 p-1 rounded-lg mb-5">
                  <button
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${!otpMode ? "bg-white text-[#1F3864] shadow-sm" : "text-gray-500"}`}
                    onClick={() => setOtpMode(false)}
                  >
                    Email / Password
                  </button>
                  <button
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${otpMode ? "bg-white text-[#1F3864] shadow-sm" : "text-gray-500"}`}
                    onClick={() => setOtpMode(true)}
                  >
                    OTP Login
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {otpMode ? "Mobile Number" : "Official Email or Mobile"}
                    </label>
                    <input
                      id="email"
                      type={otpMode ? "tel" : "email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={otpMode ? "Enter 10-digit mobile number" : "user@gov.in"}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50"
                      autoComplete="email"
                    />
                  </div>

                  {!otpMode && (
                    <div>
                      <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50 pr-10"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Role selector */}
                  <div>
                    <label htmlFor="role-select" className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Sign in as
                    </label>
                    <select
                      id="role-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50"
                    >
                      <option value="ministry">Ministry / DoLR</option>
                      <option value="state">State Government</option>
                      <option value="district">District Administration</option>
                      <option value="pia">Project Implementing Agency</option>
                      <option value="field">Field Officer</option>
                      <option value="citizen">Citizen</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#1F3864] text-white font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock size={15} />
                        Sign In Securely
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button type="button" className="text-xs text-[#1F3864] hover:underline">
                      Forgot password / OTP not received?
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-200" />
                  <p className="text-xs text-gray-400">Or use prototype demo access</p>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Demo access buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map((dr) => (
                    <button
                      key={dr.role}
                      onClick={() => handleDemoAccess(dr.role)}
                      disabled={loading}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-left hover:bg-gray-50 transition-colors disabled:opacity-60"
                      aria-label={`Continue as ${dr.label} (prototype demo access)`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: dr.color }}
                      >
                        {dr.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-800 truncate">{dr.label}</p>
                        <p className="text-[10px] text-gray-500 truncate">{dr.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-center text-[10px] text-gray-400 mt-3">
                  Prototype demo access · No authentication required in this environment
                </p>
              </div>

              {/* Footer links */}
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><Shield size={10} /> Accessibility support available</span>
                <Link href="/help" className="hover:underline">Help & Helpdesk</Link>
                <span>Privacy Notice</span>
              </div>
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-4">
              Prototype for Smart India Hackathon 2026 · All data is illustrative
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
