"use server";

import { cookies } from "next/headers";
import { AuthSession } from "@/lib/auth";
import { SAMPLE_RNR_BENEFICIARIES, RnrBeneficiary } from "@/lib/mockData";

export async function getAuthorizedRnrRecords(): Promise<{ success: boolean; data?: RnrBeneficiary[]; error?: string }> {
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

    if (user.role === "citizen") {
      // In a real database, we would query by user.id or citizen.aadhaar.
      // Here, we just filter the mock dataset. Ramesh is not in the mock dataset,
      // so this will naturally return an empty array for him, fulfilling the requirement.
      const citizenRecords = SAMPLE_RNR_BENEFICIARIES.filter((r) => r.familyHead === user.name);
      return { success: true, data: citizenRecords };
    }

    // For all authorized administrative roles, return the full dataset.
    return { success: true, data: SAMPLE_RNR_BENEFICIARIES };
  } catch (err) {
    console.error("R&R Authorization check failed:", err);
    return { success: false, error: "Unauthorised: Failed to verify permissions." };
  }
}
