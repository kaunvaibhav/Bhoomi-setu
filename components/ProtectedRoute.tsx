"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EAF0F8] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-[#1F3864] flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-[#1F3864] mb-1">
            Verifying Authentication
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Checking session credentials with BhoomiSetu security services...
          </p>
          <div className="w-6 h-6 border-2 border-[#1F3864] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // If role restrictions apply
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#EAF0F8] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 shadow-card p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Shield size={22} />
          </div>
          <h3 className="text-base font-bold text-red-900 mb-1">
            Access Restricted by Role
          </h3>
          <p className="text-xs text-gray-600 mb-5 leading-relaxed">
            Your authenticated role (<strong>{user.roleTitle}</strong>) does not
            have authorization to access this specific module.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-[#1F3864] text-white text-xs font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors"
          >
            Return to Authorized Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
