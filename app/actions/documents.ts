"use server";

import { cookies } from "next/headers";
import { ALL_SYSTEM_DOCUMENTS, Document } from "@/lib/mockData";

export async function getAuthorizedDocuments(): Promise<{ success: boolean; data?: Document[]; error?: string }> {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("bhoomisetu_auth");

    if (!authCookie) {
      return { success: false, error: "Unauthorized access. No session found." };
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(authCookie.value));
    } catch (e) {
      return { success: false, error: "Invalid session cookie format." };
    }

    const { role } = session;

    if (role === "citizen") {
      // Return only public documents (Gazette, Section 11, Section 19)
      // Hide internal types (SIA, Survey, Award, Possession)
      const allowedDocs = ALL_SYSTEM_DOCUMENTS.filter(
        (doc) =>
          doc.type.toLowerCase().includes("section") ||
          doc.type.toLowerCase().includes("gazette")
      );
      return { success: true, data: allowedDocs };
    }

    // For other roles, return all docs
    return { success: true, data: ALL_SYSTEM_DOCUMENTS };
  } catch (error) {
    console.error("Error in getAuthorizedDocuments:", error);
    return { success: false, error: "Internal server error during document authorization." };
  }
}
