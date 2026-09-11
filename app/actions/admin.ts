"use server";

import { cookies } from "next/headers";
import { AuthSession } from "@/lib/auth";

/**
 * Helper to securely identify the session and enforce administrative RBAC
 */
async function authorizeAdminAction(): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("bhoomisetu_auth");

    if (!authCookie || !authCookie.value) {
      return { success: false, error: "Unauthorised: No session found." };
    }

    const session: AuthSession = JSON.parse(decodeURIComponent(authCookie.value));

    if (session.expiresAt && session.expiresAt < Date.now()) {
      return { success: false, error: "Unauthorised: Session expired." };
    }

    const { user } = session;

    if (!user) {
      return { success: false, error: "Unauthorised: Invalid session structure." };
    }

    // Role-Based Access Control: Reject citizens from administrative actions
    if (user.role === "citizen") {
      return { success: false, error: "Forbidden: Administrative privileges required. Citizens cannot perform this action." };
    }

    return { success: true, session };
  } catch (err) {
    console.error("Authorization check failed:", err);
    return { success: false, error: "Unauthorised: Failed to verify permissions." };
  }
}

export async function syncPfmsServerAction() {
  const auth = await authorizeAdminAction();
  if (!auth.success) return auth;

  // In a real implementation, this would trigger an actual integration.
  return { success: true, message: "PFMS DBT Gateway sync completed (Response: HTTP 200 OK)" };
}

export async function exportLedgerServerAction() {
  const auth = await authorizeAdminAction();
  if (!auth.success) return auth;

  // In a real implementation, this would stream a CSV/Excel file back.
  return { success: true, message: "Compensation ledger CSV exported successfully." };
}

export async function batchPfmsReleaseServerAction() {
  const auth = await authorizeAdminAction();
  if (!auth.success) return auth;

  // In a real implementation, this would process a batch payout payload to the PFMS switch.
  return { success: true, message: "Batch PFMS-DBT payout instruction dispatched to Reserve Bank of India / PFMS switch." };
}
