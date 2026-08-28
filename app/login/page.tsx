"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Copy,
} from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { PROTOTYPE_CREDENTIALS, UserRole } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("ministry");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // If already logged in, route to authorized dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, user, redirectUrl, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    // Validation checks
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Invalid email or password");
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password, selectedRole);

      if (!res.success) {
        setErrorMessage(res.error || "Invalid email or password");
        setLoading(false);
      } else {
        // Redirection based on role
        router.push(redirectUrl);
      }
    } catch {
      setErrorMessage("Invalid email or password");
      setLoading(false);
    }
  }

  // Quick fill helper for evaluator convenience (populates fields only, does not bypass login)
  function handleQuickFill(credEmail: string, credPass: string, credRole: UserRole) {
    setEmail(credEmail);
    setPassword(credPass);
    setSelectedRole(credRole);
    setErrorMessage(null);
    setCopiedKey(credEmail);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-7">
        <Link href="/" className="inline-block mb-3">
          <div className="text-3xl font-extrabold text-[#1F3864] tracking-tight">
            BhoomiSetu
          </div>
          <div className="text-xs text-gray-500 font-medium">भूमि सेतु</div>
        </Link>
        <h1 className="text-2xl font-bold text-[#1F3864] mb-1.5">
          Sign in to BhoomiSetu
        </h1>
        <p className="text-sm font-semibold text-[#1F3864]">
          Government of India · Ministry of Rural Development
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Department of Land Resources (DoLR)
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card-lg overflow-hidden">
        {/* Security Notice Strip */}
        <div className="bg-[#1F3864] text-white px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Lock size={13} className="text-[#FF9933]" />
            <span className="font-semibold tracking-wide">
              Secure Government Portal Login
            </span>
          </div>
          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
            SIH 2026 Prototype
          </span>
        </div>

        <div className="p-6">
          {/* Error Message Alert */}
          {errorMessage && (
            <div
              className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-left animate-shake"
              role="alert"
            >
              <AlertCircle
                size={18}
                className="text-red-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs font-bold text-red-800">
                  Authentication Failed
                </p>
                <p className="text-xs text-red-700 mt-0.5 leading-snug">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Official Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="e.g. ministry@bhoomisetu.gov.in"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50 transition-all font-mono text-xs"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your official password"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50 pr-10 transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label
                htmlFor="role-select"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Sign in as (Role Verification){" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value as UserRole);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-[#1F3864] bg-gray-50 text-gray-800 transition-all"
              >
                <option value="ministry">
                  Ministry Analyst — Ministry of Rural Development | DoLR
                </option>
                <option value="district">
                  District Collector — District Administration & Land Acquisition Unit
                </option>
                <option value="pia">
                  PIA Officer — Project Implementing Agency (NHAI / Corridors)
                </option>
                <option value="citizen">
                  Citizen / Land Owner — Registered Citizen & Landholder
                </option>
              </select>
              <p className="text-[10px] text-gray-400 mt-1 italic">
                * Selected role must match the credentials of the account.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1F3864] text-white font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-md mt-2"
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
          </form>

          {/* Prototype Credentials Reference Card */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-[#1F3864]">
                <KeyRound size={14} className="text-[#FF9933]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Prototype Credentials Reference
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">
                Click “Fill” to load inputs
              </span>
            </div>

            <div className="space-y-2">
              {Object.entries(PROTOTYPE_CREDENTIALS).map(
                ([credEmail, { password: credPass, user: u }]) => {
                  const isFilled =
                    email === credEmail &&
                    password === credPass &&
                    selectedRole === u.role;
                  return (
                    <div
                      key={credEmail}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                        isFilled
                          ? "bg-blue-50/80 border-blue-300"
                          : "bg-slate-50 hover:bg-slate-100 border-gray-200"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1F3864]">
                            {u.roleTitle}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-gray-500 border border-gray-200">
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600 font-mono mt-0.5 truncate">
                          {credEmail}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Password:{" "}
                          <span className="text-gray-700 font-semibold">
                            {credPass}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuickFill(credEmail, credPass, u.role)
                        }
                        className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isFilled
                            ? "bg-[#1F3864] text-white border-[#1F3864]"
                            : "bg-white text-[#1F3864] hover:bg-blue-50 border-gray-300"
                        }`}
                        title="Populate form fields with these credentials"
                      >
                        {isFilled ? (
                          <>
                            <CheckCircle2 size={12} className="text-green-300" />
                            <span>Loaded</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Fill</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                }
              )}
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-3 leading-relaxed">
              * Authentication is fully validated. You must click{" "}
              <strong>“Sign In Securely”</strong> to verify credentials and
              access the role-specific dashboard.
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <Shield size={11} className="text-green-600" />
            256-Bit SSL Encrypted Protocol
          </span>
          <Link href="/help" className="hover:underline">
            Helpdesk & Support
          </Link>
          <Link href="/" className="hover:underline">
            Back to Home
          </Link>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-500 mt-4 leading-relaxed">
        Smart India Hackathon 2026 Prototype · Ministry of Rural Development ·
        Department of Land Resources (DoLR) · Government of India
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <TopUtilityBar />
      <div className="min-h-screen bg-[#EAF0F8] flex flex-col">
        <main
          id="main-content"
          className="flex-1 flex items-center justify-center py-10 px-4"
        >
          <Suspense
            fallback={
              <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-card text-center">
                <div className="w-6 h-6 border-2 border-[#1F3864] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-500">Loading Secure Login...</p>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
