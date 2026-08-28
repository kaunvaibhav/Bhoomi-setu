"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  AuthSession,
  validateCredentials,
  saveAuthSession,
  clearAuthSession,
  getClientSession,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    role?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from client storage
  useEffect(() => {
    const existing = getClientSession();
    if (existing) {
      setSession(existing);
    } else {
      setSession(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    setIsLoading(true);

    // Simulate standard async auth network latency (300ms) for realistic UX
    await new Promise((res) => setTimeout(res, 300));

    const result = validateCredentials(email, password, role);

    if (result.success && result.session) {
      saveAuthSession(result.session);
      setSession(result.session);
      setIsLoading(false);
      return { success: true };
    } else {
      setIsLoading(false);
      return {
        success: false,
        error: result.error || "Invalid email or password",
      };
    }
  };

  const logout = () => {
    clearAuthSession();
    setSession(null);
    router.push("/login");
  };

  const value: AuthContextType = {
    user: session?.user || null,
    session,
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
