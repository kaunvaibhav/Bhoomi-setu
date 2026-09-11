"use server";

import { cookies } from "next/headers";

export interface AlertItem {
  id: string;
  type: "danger" | "warning" | "info";
  category: "Valuation" | "Timeline" | "Document" | "R&R";
  title: string;
  description: string;
  timestamp: string;
  link: string;
  linkText: string;
  isRead: boolean;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "ALT-001",
    type: "danger",
    category: "Valuation",
    title: "12 Valuation Awards Require Collector Scrutiny",
    description: "AI Anomaly Detection scored compensation awards > 60% deviation from historical circle rates in Varanasi and Jaisalmer sectors.",
    timestamp: "10 mins ago",
    link: "/valuation-review",
    linkText: "Open AI Valuation Review",
    isRead: false,
  },
  {
    id: "ALT-002",
    type: "warning",
    category: "Timeline",
    title: "Possession Milestone Delay Risk — Krishna Basin Scheme",
    description: "Stage 7 land survey is 14 days behind schedule due to pending boundary verification in 2 villages.",
    timestamp: "1 hour ago",
    link: "/projects/PROJ-KA-004",
    linkText: "Inspect Project Lifecycle",
    isRead: false,
  },
  {
    id: "ALT-003",
    type: "warning",
    category: "Document",
    title: "4 Section 19 Gazette Declarations Awaiting State Digital Signature",
    description: "Objection hearing periods elapsed with zero pending objections. Requires authorized e-Sign stamp.",
    timestamp: "3 hours ago",
    link: "/dashboard/documents",
    linkText: "Open Gazette Vault",
    isRead: false,
  },
  {
    id: "ALT-004",
    type: "info",
    category: "R&R",
    title: "7 R&R Family Beneficiary Details Verified for DBT Release",
    description: "Aadhaar and bank account validation confirmed by PFMS switch for Model Resettlement Colony B.",
    timestamp: "5 hours ago",
    link: "/dashboard/rnr",
    linkText: "View R&R Beneficiaries",
    isRead: true,
  },
];

const CITIZEN_ALERTS: AlertItem[] = [
  {
    id: "ALT-CIT-001",
    type: "info",
    category: "Timeline",
    title: "Section 11 Hearing Scheduled",
    description: "A formal objection hearing has been scheduled with the District Collector for your registered parcel.",
    timestamp: "2 days ago",
    link: "/track-case",
    linkText: "View Hearing Details",
    isRead: false,
  },
  {
    id: "ALT-CIT-002",
    type: "info",
    category: "Document",
    title: "New Public Notice Uploaded",
    description: "A new Section 19 final declaration for your district has been published in the Gazette.",
    timestamp: "1 week ago",
    link: "/notifications",
    linkText: "View Notice",
    isRead: true,
  },
];

export async function getAuthorizedAlerts(): Promise<{ success: boolean; data?: AlertItem[]; error?: string }> {
  try {
    const cookieStore = await cookies();
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
      return { success: true, data: CITIZEN_ALERTS };
    }

    return { success: true, data: INITIAL_ALERTS };
  } catch (error) {
    console.error("Error in getAuthorizedAlerts:", error);
    return { success: false, error: "Internal server error during alerts authorization." };
  }
}
