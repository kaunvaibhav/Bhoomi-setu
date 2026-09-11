"use server";

import { cookies } from "next/headers";
import { SAMPLE_COMPENSATION_TRANSACTIONS, CompensationTransaction } from "@/lib/mockData";
import { AuthSession } from "@/lib/auth";

export async function getAuthorizedCompensationRecords(): Promise<{ success: boolean; data?: CompensationTransaction[]; error?: string }> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("bhoomisetu_auth");

    if (!authCookie || !authCookie.value) {
      return { success: false, error: "Unauthorized access. No session found." };
    }

    const session: AuthSession = JSON.parse(decodeURIComponent(authCookie.value));

    // Verify session expiry
    if (session.expiresAt && session.expiresAt < Date.now()) {
      return { success: false, error: "Session expired." };
    }

    const { user } = session;

    if (!user) {
      return { success: false, error: "Invalid session structure." };
    }

    // Role-Based Access Control
    if (user.role === "citizen") {
      // Citizen constraint: return ONLY their own compensation records.
      // Filter the data at the server boundary before it reaches the client.
      const citizenData = SAMPLE_COMPENSATION_TRANSACTIONS.filter(
        (t) => t.beneficiaryName === user.name
      );
      return { success: true, data: citizenData };
    } else {
      // Administrative / Official constraints: return all or jurisdiction-specific records.
      return { success: true, data: SAMPLE_COMPENSATION_TRANSACTIONS };
    }
  } catch (err) {
    console.error("Error authenticating action:", err);
    return { success: false, error: "Failed to authorize data request." };
  }
}
