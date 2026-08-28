// BhoomiSetu Functional Authentication Module
// Smart India Hackathon 2026 Prototype
// Government of India · Ministry of Rural Development · Department of Land Resources (DoLR)

export type UserRole = "ministry" | "district" | "pia" | "citizen" | "state" | "field";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  jurisdiction?: string;
  avatarInitials: string;
}

export interface AuthSession {
  user: User;
  token: string;
  loginTime: string;
  expiresAt: number;
}

// ── PROTOTYPE USER CREDENTIALS ────────────────────────────────────────────────
// Pre-configured official prototype accounts
export const PROTOTYPE_CREDENTIALS: Record<
  string,
  { password: string; user: User }
> = {
  "ministry@bhoomisetu.gov.in": {
    password: "Ministry@123",
    user: {
      id: "usr_mord_001",
      email: "ministry@bhoomisetu.gov.in",
      name: "Dr. Rajesh Sharma",
      role: "ministry",
      roleTitle: "Ministry Analyst",
      department: "Ministry of Rural Development | Department of Land Resources (DoLR)",
      jurisdiction: "National Level (All States & UTs)",
      avatarInitials: "RS",
    },
  },
  "collector@bhoomisetu.gov.in": {
    password: "Collector@123",
    user: {
      id: "usr_dist_002",
      email: "collector@bhoomisetu.gov.in",
      name: "Priya Nair, IAS",
      role: "district",
      roleTitle: "District Collector",
      department: "District Administration & Land Acquisition Unit",
      jurisdiction: "Varanasi District, Uttar Pradesh",
      avatarInitials: "PN",
    },
  },
  "pia@bhoomisetu.gov.in": {
    password: "PIA@123",
    user: {
      id: "usr_pia_003",
      email: "pia@bhoomisetu.gov.in",
      name: "Vikramaditya Singh",
      role: "pia",
      roleTitle: "PIA Officer",
      department: "Project Implementing Agency — National Highways Authority of India (NHAI)",
      jurisdiction: "Northern Zone Infrastructure Projects",
      avatarInitials: "VS",
    },
  },
  "citizen@bhoomisetu.gov.in": {
    password: "Citizen@123",
    user: {
      id: "usr_ctz_004",
      email: "citizen@bhoomisetu.gov.in",
      name: "Ramesh Chandra Patel",
      role: "citizen",
      roleTitle: "Citizen / Land Owner",
      department: "Registered Landholder · Section 11/19 Notified Citizen",
      jurisdiction: "Parcel ID: UP-VAR-2026-089 (Kashi Freight Corridor)",
      avatarInitials: "RP",
    },
  },
};

export const AUTH_COOKIE_NAME = "bhoomisetu_auth";
export const AUTH_STORAGE_KEY = "bhoomisetu_auth_session";

// ── AUTHENTICATION VALIDATOR ──────────────────────────────────────────────────
export interface AuthResult {
  success: boolean;
  error?: string;
  session?: AuthSession;
}

export function validateCredentials(
  emailInput: string,
  passwordInput: string,
  selectedRole?: string
): AuthResult {
  const cleanEmail = (emailInput || "").trim().toLowerCase();
  const cleanPassword = (passwordInput || "").trim();

  // Rule 1 & 2: Empty checks
  if (!cleanEmail || !cleanPassword) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Lookup user
  const account = PROTOTYPE_CREDENTIALS[cleanEmail];
  if (!account) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Verify password (exact match)
  if (account.password !== cleanPassword) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Rule 7: Verify selected role matches the account role
  if (selectedRole && selectedRole !== account.user.role) {
    return {
      success: false,
      error: `Selected role does not match this account. Credentials belong to ${account.user.roleTitle}.`,
    };
  }

  // Generate session token (structured for prototype with timestamp)
  const session: AuthSession = {
    user: account.user,
    token: `bhmt_${account.user.role}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    loginTime: new Date().toISOString(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  return {
    success: true,
    session,
  };
}

// ── BROWSER STORAGE & COOKIE HELPERS ──────────────────────────────────────────
export function saveAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") return;

  try {
    const raw = JSON.stringify(session);
    // 1. Save to LocalStorage
    localStorage.setItem(AUTH_STORAGE_KEY, raw);

    // 2. Save to document.cookie for Next.js middleware checking
    const maxAge = 24 * 60 * 60; // 24 hours in seconds
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(raw)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (err) {
    console.error("Error saving auth session:", err);
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Expire cookie immediately
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch (err) {
    console.error("Error clearing auth session:", err);
  }
}

export function getClientSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    // Check localStorage first
    const fromStorage = localStorage.getItem(AUTH_STORAGE_KEY);
    if (fromStorage) {
      const parsed: AuthSession = JSON.parse(fromStorage);
      if (parsed?.expiresAt && parsed.expiresAt > Date.now()) {
        return parsed;
      }
    }

    // Fallback: check cookie
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));
    if (match) {
      const cookieValue = match.split("=")[1];
      const parsed: AuthSession = JSON.parse(decodeURIComponent(cookieValue));
      if (parsed?.expiresAt && parsed.expiresAt > Date.now()) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading client auth session:", err);
  }

  return null;
}
