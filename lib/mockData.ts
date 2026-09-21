// Illustrative prototype data only.
// Replace with verified Ministry of Rural Development / DoLR data and authorised API integrations in production.

export const SIH_META = {
  problemStatementId: "SIH26016",
  problemStatement: "Real-Time National Land Acquisition & Management System",
  country: "Government of India",
  organization: "Ministry of Rural Development",
  department: "Department of Land Resources (DoLR)",
  theme: "Smart Governance",
  category: "Software",
  teamId: "144946",
  teamName: "Hard Forkers",
  lastSynced: "29 Aug 2026, 11:45 PM",
};

export const SAMPLE_STATES = [
  {
    id: "UP",
    name: "Uttar Pradesh",
    activeProjects: 14,
    areaNotified: 8420,
    possessionPercent: 62,
    status: "in-progress",
    color: "#1F3864",
  },
  {
    id: "RJ",
    name: "Rajasthan",
    activeProjects: 9,
    areaNotified: 6180,
    possessionPercent: 45,
    status: "at-risk",
    color: "#E85D04",
  },
  {
    id: "MH",
    name: "Maharashtra",
    activeProjects: 11,
    areaNotified: 4320,
    possessionPercent: 78,
    status: "on-track",
    color: "#138808",
  },
  {
    id: "KA",
    name: "Karnataka",
    activeProjects: 7,
    areaNotified: 3140,
    possessionPercent: 55,
    status: "in-progress",
    color: "#7C3AED",
  },
  {
    id: "MP",
    name: "Madhya Pradesh",
    activeProjects: 8,
    areaNotified: 2800,
    possessionPercent: 38,
    status: "at-risk",
    color: "#D97706",
  },
];

export type ProjectStatus = "on-track" | "in-progress" | "at-risk" | "delayed" | "completed";
export type ProjectType = "Highway" | "Railway" | "Industrial Corridor" | "Irrigation" | "Renewable Energy" | "Urban Development";

export interface Project {
  id: string;
  name: string;
  state: string;
  district: string;
  type: ProjectType;
  requiringBody: string;
  landRequired: number; // hectares
  landNotified: number;
  landAcquired: number;
  affectedFamilies: number;
  compensationAssessed: number; // crores
  compensationDisbursed: number;
  possessionPercent: number;
  currentStage: number; // 1-12
  status: ProjectStatus;
  lastUpdated: string;
  description: string;
  parcels: Parcel[];
  documents: Document[];
}

export interface Parcel {
  id: string;
  ulpin: string;
  area: number; // sq m
  landType: string;
  irrigationStatus: string;
  district: string;
  village: string;
  ownerName: string;
  declaredValue: number;
  expectedRangeLow: number;
  expectedRangeHigh: number;
  anomalyScore: number;
  flagged: boolean;
  status: "acquired" | "pending" | "disputed" | "compensated";
  reviewStatus: "pending" | "reviewed" | "approved" | "reassessment-requested";
}

export interface Document {
  id: string;
  name: string;
  type: string;
  version: string;
  date: string;
  uploaderRole: string;
  size: string;
  url: string;
}

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "PROJ-UP-001",
    name: "Eastern Freight Connectivity Corridor",
    state: "Uttar Pradesh",
    district: "Varanasi",
    type: "Railway",
    requiringBody: "National Highways Authority of India",
    landRequired: 2840,
    landNotified: 2840,
    landAcquired: 1920,
    affectedFamilies: 3240,
    compensationAssessed: 1842,
    compensationDisbursed: 1462,
    possessionPercent: 68,
    currentStage: 9,
    status: "in-progress",
    lastUpdated: "28 Aug 2026, 09:15 AM",
    description: "A strategic freight rail connectivity project linking eastern UP to the national freight network. Involves acquisition of agricultural and mixed-use land across 6 districts.",
    parcels: [
      {
        id: "UP-AGR-004821",
        ulpin: "UP0603002100482",
        area: 4820,
        landType: "Agricultural",
        irrigationStatus: "Irrigated",
        district: "Varanasi",
        village: "Rampur Khas",
        ownerName: "Ramesh K.",
        declaredValue: 3100000,
        expectedRangeLow: 4200000,
        expectedRangeHigh: 4800000,
        anomalyScore: 62,
        flagged: true,
        status: "pending",
        reviewStatus: "pending",
      },
      {
        id: "UP-AGR-004822",
        ulpin: "UP0603002100483",
        area: 3200,
        landType: "Agricultural",
        irrigationStatus: "Rain-fed",
        district: "Varanasi",
        village: "Rampur Khas",
        ownerName: "Sunita D.",
        declaredValue: 2800000,
        expectedRangeLow: 2600000,
        expectedRangeHigh: 3100000,
        anomalyScore: 18,
        flagged: false,
        status: "compensated",
        reviewStatus: "reviewed",
      },
      {
        id: "UP-AGR-004895",
        ulpin: "UP0603002100556",
        area: 6140,
        landType: "Agricultural",
        irrigationStatus: "Irrigated",
        district: "Chandauli",
        village: "Sehgaon",
        ownerName: "Mohan L.",
        declaredValue: 5200000,
        expectedRangeLow: 4800000,
        expectedRangeHigh: 5500000,
        anomalyScore: 22,
        flagged: false,
        status: "acquired",
        reviewStatus: "reviewed",
      },
    ],
    documents: [
      { id: "D001", name: "Social Impact Assessment Report", type: "SIA", version: "v2.1", date: "12 Jan 2026", uploaderRole: "District Collector", size: "4.2 MB", url: "#" },
      { id: "D002", name: "Section 11 Notification", type: "Legal", version: "v1.0", date: "03 Feb 2026", uploaderRole: "State Government", size: "1.1 MB", url: "#" },
      { id: "D003", name: "Objection Register", type: "Legal", version: "v1.2", date: "15 Mar 2026", uploaderRole: "District Collector", size: "2.8 MB", url: "#" },
      { id: "D004", name: "Survey and Measurement Report", type: "Survey", version: "v1.0", date: "20 Apr 2026", uploaderRole: "Field Officer", size: "8.4 MB", url: "#" },
      { id: "D005", name: "Award Statement (Draft)", type: "Award", version: "v0.9", date: "10 Jul 2026", uploaderRole: "Land Acquisition Officer", size: "3.1 MB", url: "#" },
    ],
  },
  {
    id: "PROJ-RJ-002",
    name: "Renewable Energy Transmission Corridor",
    state: "Rajasthan",
    district: "Jaisalmer",
    type: "Renewable Energy",
    requiringBody: "Power Grid Corporation of India",
    landRequired: 6200,
    landNotified: 4800,
    landAcquired: 2160,
    affectedFamilies: 1820,
    compensationAssessed: 982,
    compensationDisbursed: 441,
    possessionPercent: 45,
    currentStage: 7,
    status: "at-risk",
    lastUpdated: "27 Aug 2026, 03:30 PM",
    description: "High-capacity transmission corridor for renewable energy evacuation from solar parks in western Rajasthan. Crosses arid and semi-arid land across 4 districts.",
    parcels: [
      {
        id: "RJ-ARD-002187",
        ulpin: "RJ1401001002187",
        area: 12400,
        landType: "Arid / Wasteland",
        irrigationStatus: "Non-irrigated",
        district: "Jaisalmer",
        village: "Khuri",
        ownerName: "Priya M.",
        declaredValue: 480000,
        expectedRangeLow: 800000,
        expectedRangeHigh: 1100000,
        anomalyScore: 74,
        flagged: true,
        status: "pending",
        reviewStatus: "pending",
      },
    ],
    documents: [
      { id: "D006", name: "Social Impact Assessment Report", type: "SIA", version: "v1.0", date: "05 Nov 2025", uploaderRole: "SIA Agency", size: "6.8 MB", url: "#" },
      { id: "D007", name: "Section 11 Notification", type: "Legal", version: "v1.0", date: "22 Dec 2025", uploaderRole: "State Government", size: "0.9 MB", url: "#" },
    ],
  },
  {
    id: "PROJ-MH-003",
    name: "Regional Railway Expansion – Pune Node",
    state: "Maharashtra",
    district: "Pune",
    type: "Railway",
    requiringBody: "Maharashtra Rail Infrastructure Development Corporation",
    landRequired: 1840,
    landNotified: 1840,
    landAcquired: 1432,
    affectedFamilies: 2140,
    compensationAssessed: 2241,
    compensationDisbursed: 1988,
    possessionPercent: 78,
    currentStage: 10,
    status: "on-track",
    lastUpdated: "28 Aug 2026, 11:00 AM",
    description: "Urban rail expansion connecting Pune metropolitan region to the national rail grid. Primarily involves mixed-use urban and peri-urban land.",
    parcels: [
      {
        id: "MH-URB-006902",
        ulpin: "MH2101003006902",
        area: 2800,
        landType: "Urban / Residential",
        irrigationStatus: "N/A",
        district: "Pune",
        village: "Hadapsar",
        ownerName: "Kavita S.",
        declaredValue: 8400000,
        expectedRangeLow: 7800000,
        expectedRangeHigh: 9200000,
        anomalyScore: 15,
        flagged: false,
        status: "compensated",
        reviewStatus: "reviewed",
      },
    ],
    documents: [
      { id: "D008", name: "Detailed Project Report", type: "DPR", version: "v3.0", date: "08 Jul 2025", uploaderRole: "PIA Officer", size: "22.4 MB", url: "#" },
      { id: "D009", name: "Section 11 Notification", type: "Legal", version: "v1.0", date: "14 Sep 2025", uploaderRole: "State Government", size: "1.3 MB", url: "#" },
      { id: "D010", name: "Survey and Measurement Report", type: "Survey", version: "v2.0", date: "10 Nov 2025", uploaderRole: "Field Officer", size: "12.1 MB", url: "#" },
      { id: "D011", name: "Award Statement", type: "Award", version: "v1.0", date: "20 Jan 2026", uploaderRole: "Land Acquisition Officer", size: "4.8 MB", url: "#" },
      { id: "D012", name: "Possession Certificate (Partial)", type: "Possession", version: "v1.0", date: "15 Apr 2026", uploaderRole: "District Collector", size: "1.2 MB", url: "#" },
      { id: "D013", name: "R&R Plan", type: "R&R", version: "v1.1", date: "01 Mar 2026", uploaderRole: "State Government", size: "3.4 MB", url: "#" },
    ],
  },
  {
    id: "PROJ-KA-004",
    name: "Irrigation Modernisation Scheme – Krishna Basin",
    state: "Karnataka",
    district: "Raichur",
    type: "Irrigation",
    requiringBody: "Karnataka Neeravari Nigam Limited",
    landRequired: 3120,
    landNotified: 2400,
    landAcquired: 1320,
    affectedFamilies: 4820,
    compensationAssessed: 1124,
    compensationDisbursed: 618,
    possessionPercent: 55,
    currentStage: 8,
    status: "in-progress",
    lastUpdated: "26 Aug 2026, 05:45 PM",
    description: "Modernisation and expansion of the Krishna river basin irrigation network. Involves acquisition of agricultural land across 3 taluks in northern Karnataka.",
    parcels: [],
    documents: [
      { id: "D014", name: "Social Impact Assessment Report", type: "SIA", version: "v1.3", date: "18 Feb 2026", uploaderRole: "SIA Agency", size: "9.1 MB", url: "#" },
      { id: "D015", name: "Section 11 Notification", type: "Legal", version: "v1.0", date: "12 Apr 2026", uploaderRole: "State Government", size: "1.0 MB", url: "#" },
      { id: "D016", name: "Objection Register", type: "Legal", version: "v1.0", date: "28 May 2026", uploaderRole: "District Collector", size: "1.6 MB", url: "#" },
      { id: "D017", name: "Survey Report (In Progress)", type: "Survey", version: "v0.7", date: "14 Aug 2026", uploaderRole: "Field Officer", size: "5.2 MB", url: "#" },
    ],
  },
  {
    id: "PROJ-MP-005",
    name: "Industrial Logistics Park – Bhopal Corridor",
    state: "Madhya Pradesh",
    district: "Bhopal",
    type: "Industrial Corridor",
    requiringBody: "MP Industrial Development Corporation",
    landRequired: 920,
    landNotified: 680,
    landAcquired: 258,
    affectedFamilies: 640,
    compensationAssessed: 553,
    compensationDisbursed: 233,
    possessionPercent: 38,
    currentStage: 6,
    status: "delayed",
    lastUpdated: "25 Aug 2026, 08:00 AM",
    description: "Development of an integrated logistics park to support the Delhi–Mumbai Industrial Corridor. Faces delay due to pending objection hearings.",
    parcels: [],
    documents: [
      { id: "D018", name: "Detailed Project Report", type: "DPR", version: "v2.0", date: "10 Oct 2025", uploaderRole: "PIA Officer", size: "15.8 MB", url: "#" },
      { id: "D019", name: "Administrative Approval", type: "Admin", version: "v1.0", date: "22 Nov 2025", uploaderRole: "Ministry", size: "0.8 MB", url: "#" },
      { id: "D020", name: "Section 11 Notification", type: "Legal", version: "v1.0", date: "18 Jan 2026", uploaderRole: "State Government", size: "1.1 MB", url: "#" },
    ],
  },
  {
    id: "PROJ-UP-006",
    name: "Western Bypass Highway – Stage 2 Pilot",
    state: "Uttar Pradesh",
    district: "Varanasi",
    type: "Highway",
    requiringBody: "National Highways Authority of India",
    landRequired: 1450,
    landNotified: 0,
    landAcquired: 0,
    affectedFamilies: 820,
    compensationAssessed: 0,
    compensationDisbursed: 0,
    possessionPercent: 0,
    currentStage: 2,
    status: "in-progress",
    lastUpdated: "29 Aug 2026, 12:00 PM",
    description: "Proposed bypass highway to reduce congestion around Western Varanasi. Currently undergoing preliminary scrutiny by the District Collector.",
    parcels: [],
    documents: [
      { id: "D021", name: "Detailed Project Report", type: "DPR", version: "v1.0", date: "20 Aug 2026", uploaderRole: "PIA Officer", size: "12.4 MB", url: "#" },
      { id: "D022", name: "Land Requirement Plan", type: "Map", version: "v1.0", date: "20 Aug 2026", uploaderRole: "PIA Officer", size: "3.2 MB", url: "#" },
      { id: "D023", name: "Feasibility Report", type: "Study", version: "v1.0", date: "20 Aug 2026", uploaderRole: "PIA Officer", size: "5.7 MB", url: "#" },
    ],
  },
];

// KPI Summary (illustrative)
export const NATIONAL_KPIS = {
  areaNotified: 24860,
  areaNotifiedChange: 8.4,
  areaAcquired: 16420,
  areaAcquiredPercent: 66.1,
  compensationDisbursed: 8742,
  compensationDisbursedPercent: 78.6,
  possessionProgress: 71.4,
  valuationFlags: 38,
};

// Charts data
export const STATE_AREA_DATA = [
  { state: "UP", notified: 8420, acquired: 5220 },
  { state: "RJ", notified: 6180, acquired: 2780 },
  { state: "MH", notified: 4320, acquired: 3370 },
  { state: "KA", notified: 3140, acquired: 1730 },
  { state: "MP", notified: 2800, acquired: 1320 },
];

export const COMPENSATION_DATA = [
  { state: "UP", assessed: 1842, disbursed: 1462 },
  { state: "RJ", assessed: 982, disbursed: 441 },
  { state: "MH", assessed: 2241, disbursed: 1988 },
  { state: "KA", assessed: 1124, disbursed: 618 },
  { state: "MP", assessed: 553, disbursed: 233 },
];

export const STAGE_DISTRIBUTION = [
  { stage: "Proposal", count: 12 },
  { stage: "Scrutiny", count: 8 },
  { stage: "SIA", count: 6 },
  { stage: "Notification", count: 9 },
  { stage: "Objection", count: 5 },
  { stage: "Declaration", count: 7 },
  { stage: "Survey", count: 11 },
  { stage: "Award", count: 14 },
  { stage: "Compensation", count: 18 },
  { stage: "Possession", count: 9 },
  { stage: "R&R", count: 6 },
  { stage: "Handover", count: 4 },
];

export const MONTHLY_PROGRESS = [
  { month: "Mar", notified: 18200, acquired: 11400 },
  { month: "Apr", notified: 19800, acquired: 12600 },
  { month: "May", notified: 21400, acquired: 13200 },
  { month: "Jun", notified: 22100, acquired: 14100 },
  { month: "Jul", notified: 23600, acquired: 15200 },
  { month: "Aug", notified: 24860, acquired: 16420 },
];

// Citizen case
export const CITIZEN_CASE = {
  id: "BS-UP-2026-004821",
  ownerName: "Ramesh K***",
  project: "Eastern Freight Connectivity Corridor",
  village: "Rampur Khas",
  district: "Varanasi",
  state: "Uttar Pradesh",
  parcelId: "UP-AGR-004821",
  currentStage: 8,
  lastUpdated: "28 Aug 2026",
  assignedOffice: "Office of Land Acquisition Collector, Varanasi",
  expectedNextAction: "Award Declaration — Compensation amount under authorised review",
  compensationAssessed: 4200000,
  compensationDisbursed: 0,
  compensationStatus: "Awaiting final approval",
  hasAiReview: true,
};

// Flagged valuation parcels
export const FLAGGED_PARCELS = [
  {
    parcelId: "UP-AGR-004821",
    project: "Eastern Freight Connectivity Corridor",
    state: "Uttar Pradesh",
    landType: "Agricultural",
    declaredValue: 3100000,
    expectedRangeLow: 4200000,
    expectedRangeHigh: 4800000,
    anomalyScore: 62,
    flag: "Below expected range",
    reviewStatus: "Pending review",
    comparables: 9,
    searchRadius: 2,
    lookbackMonths: 18,
    circleRate: 3800000,
    distToHighway: 1.2,
    infraAnnouncement: true,
  },
  {
    parcelId: "RJ-ARD-002187",
    project: "Renewable Energy Transmission Corridor",
    state: "Rajasthan",
    landType: "Arid / Wasteland",
    declaredValue: 480000,
    expectedRangeLow: 800000,
    expectedRangeHigh: 1100000,
    anomalyScore: 74,
    flag: "Significantly below expected range",
    reviewStatus: "Pending review",
    comparables: 6,
    searchRadius: 5,
    lookbackMonths: 24,
    circleRate: 750000,
    distToHighway: 4.8,
    infraAnnouncement: true,
  },
  {
    parcelId: "MP-IND-008841",
    project: "Industrial Logistics Park – Bhopal Corridor",
    state: "Madhya Pradesh",
    landType: "Mixed Use",
    declaredValue: 9800000,
    expectedRangeLow: 6500000,
    expectedRangeHigh: 8200000,
    anomalyScore: 58,
    flag: "Above expected range",
    reviewStatus: "Pending review",
    comparables: 11,
    searchRadius: 3,
    lookbackMonths: 12,
    circleRate: 7200000,
    distToHighway: 0.8,
    infraAnnouncement: false,
  },
  {
    parcelId: "KA-AGR-011204",
    project: "Irrigation Modernisation Scheme – Krishna Basin",
    state: "Karnataka",
    landType: "Agricultural",
    declaredValue: 2200000,
    expectedRangeLow: 3100000,
    expectedRangeHigh: 3600000,
    anomalyScore: 67,
    flag: "Below expected range",
    reviewStatus: "Reviewed",
    comparables: 14,
    searchRadius: 4,
    lookbackMonths: 18,
    circleRate: 2900000,
    distToHighway: 2.1,
    infraAnnouncement: false,
  },
  {
    parcelId: "UP-AGR-005102",
    project: "Eastern Freight Connectivity Corridor",
    state: "Uttar Pradesh",
    landType: "Agricultural",
    declaredValue: 2600000,
    expectedRangeLow: 3800000,
    expectedRangeHigh: 4400000,
    anomalyScore: 71,
    flag: "Below expected range",
    reviewStatus: "Pending review",
    comparables: 7,
    searchRadius: 2,
    lookbackMonths: 18,
    circleRate: 3500000,
    distToHighway: 1.8,
    infraAnnouncement: true,
  },
];

export const VALUATION_KPIS = {
  awardsReviewed: 142,
  flagsRequiringReview: 38,
  averageAnomalyScore: 48,
  lowConfidenceRegions: 4,
};

// Dashboard alerts
export const DASHBOARD_ALERTS = [
  { id: "ALT-001", type: "warning", message: "3 projects may miss possession milestones this quarter", link: "/dashboard" },
  { id: "ALT-002", type: "danger", message: "12 compensation awards require valuation review before finalisation", link: "/valuation-review" },
  { id: "ALT-003", type: "info", message: "7 R&R records have incomplete beneficiary details", link: "/dashboard" },
  { id: "ALT-004", type: "warning", message: "4 document approvals are pending at State level", link: "/dashboard" },
];

// Role definitions for demo switcher
export type UserRole = "ministry" | "state" | "district" | "lao" | "pia" | "field" | "citizen";

export const DEMO_ROLES: Record<UserRole, { label: string; description: string; color: string }> = {
  ministry: { label: "Ministry Analyst", description: "Ministry of Rural Development | Department of Land Resources (DoLR)", color: "#1F3864" },
  state: { label: "State Government Officer", description: "Uttar Pradesh Land Records Dept.", color: "#7C3AED" },
  district: { label: "District Collector", description: "Varanasi, Uttar Pradesh", color: "#0369A1" },
  lao: { label: "Land Acquisition Officer", description: "Competent Authority Land Acquisition (CALA), Varanasi", color: "#92400E" },
  pia: { label: "PIA Officer", description: "National Highways Authority of India", color: "#065F46" },
  field: { label: "Land Acquisition Officer", description: "Competent Authority Land Acquisition (CALA), Varanasi", color: "#92400E" },
  citizen: { label: "Citizen / Land Owner", description: "Case ID: BS-UP-2026-004821", color: "#1F3864" },
};

export interface CompensationTransaction {
  id: string;
  pfmsTxnId: string;
  project: string;
  projectId: string;
  beneficiaryName: string;
  aadhaarMasked: string;
  bankAccountMasked: string;
  ifscCode: string;
  parcelId: string;
  areaHa: number;
  assessedAmount: number;
  solatiumAmount: number;
  interestAmount: number;
  totalPayable: number;
  disbursedAmount: number;
  paymentMode: "PFMS-DBT" | "Direct Treasury" | "Escrow Deposit";
  status: "disbursed" | "approved" | "pending-review" | "bank-processing" | "on-hold";
  disbursedDate?: string;
  pfmsResponseCode?: string;
}

export const SAMPLE_COMPENSATION_TRANSACTIONS: CompensationTransaction[] = [
  {
    id: "CMP-UP-2026-001",
    pfmsTxnId: "PFMS-2026-UP0984129",
    project: "Eastern Freight Connectivity Corridor",
    projectId: "PROJ-UP-001",
    beneficiaryName: "Ramesh Chandra Patel",
    aadhaarMasked: "XXXX-XXXX-4821",
    bankAccountMasked: "SBI-XXXXXX9821",
    ifscCode: "SBIN0001248",
    parcelId: "UP-AGR-004821",
    areaHa: 0.482,
    assessedAmount: 3100000,
    solatiumAmount: 3100000,
    interestAmount: 372000,
    totalPayable: 6572000,
    disbursedAmount: 6572000,
    paymentMode: "PFMS-DBT",
    status: "disbursed",
    disbursedDate: "24 Aug 2026",
    pfmsResponseCode: "SUCCESS_00",
  },
  {
    id: "CMP-UP-2026-002",
    pfmsTxnId: "PFMS-2026-UP0984130",
    project: "Eastern Freight Connectivity Corridor",
    projectId: "PROJ-UP-001",
    beneficiaryName: "Sunita Devi Sharma",
    aadhaarMasked: "XXXX-XXXX-9142",
    bankAccountMasked: "PNB-XXXXXX3312",
    ifscCode: "PUNB0124900",
    parcelId: "UP-AGR-004822",
    areaHa: 0.320,
    assessedAmount: 2800000,
    solatiumAmount: 2800000,
    interestAmount: 224000,
    totalPayable: 5824000,
    disbursedAmount: 5824000,
    paymentMode: "PFMS-DBT",
    status: "disbursed",
    disbursedDate: "26 Aug 2026",
    pfmsResponseCode: "SUCCESS_00",
  },
  {
    id: "CMP-RJ-2026-003",
    pfmsTxnId: "PFMS-2026-RJ4419201",
    project: "Renewable Energy Transmission Corridor",
    projectId: "PROJ-RJ-002",
    beneficiaryName: "Priya Mohan Rathore",
    aadhaarMasked: "XXXX-XXXX-1903",
    bankAccountMasked: "BOB-XXXXXX7714",
    ifscCode: "BARB0JAISAL",
    parcelId: "RJ-ARD-002187",
    areaHa: 1.240,
    assessedAmount: 480000,
    solatiumAmount: 480000,
    interestAmount: 57600,
    totalPayable: 1017600,
    disbursedAmount: 0,
    paymentMode: "PFMS-DBT",
    status: "pending-review",
  },
  {
    id: "CMP-MH-2026-004",
    pfmsTxnId: "PFMS-2026-MH7712491",
    project: "Regional Railway Expansion – Pune Node",
    projectId: "PROJ-MH-003",
    beneficiaryName: "Kavita S. Kulkarni",
    aadhaarMasked: "XXXX-XXXX-6612",
    bankAccountMasked: "HDFC-XXXXXX4481",
    ifscCode: "HDFC0000120",
    parcelId: "MH-URB-006902",
    areaHa: 0.280,
    assessedAmount: 8400000,
    solatiumAmount: 8400000,
    interestAmount: 1008000,
    totalPayable: 17808000,
    disbursedAmount: 17808000,
    paymentMode: "PFMS-DBT",
    status: "disbursed",
    disbursedDate: "18 Aug 2026",
    pfmsResponseCode: "SUCCESS_00",
  },
  {
    id: "CMP-KA-2026-005",
    pfmsTxnId: "PFMS-2026-KA1093812",
    project: "Irrigation Modernisation Scheme – Krishna Basin",
    projectId: "PROJ-KA-004",
    beneficiaryName: "Basavaraj G. Patil",
    aadhaarMasked: "XXXX-XXXX-8823",
    bankAccountMasked: "CANARA-XXXXXX5521",
    ifscCode: "CNRB0001004",
    parcelId: "KA-AGR-011204",
    areaHa: 0.950,
    assessedAmount: 2200000,
    solatiumAmount: 2200000,
    interestAmount: 176000,
    totalPayable: 4576000,
    disbursedAmount: 0,
    paymentMode: "PFMS-DBT",
    status: "approved",
  },
  {
    id: "CMP-MP-2026-006",
    pfmsTxnId: "PFMS-2026-MP5510293",
    project: "Industrial Logistics Park – Bhopal Corridor",
    projectId: "PROJ-MP-005",
    beneficiaryName: "Anil Kumar Yadav",
    aadhaarMasked: "XXXX-XXXX-7719",
    bankAccountMasked: "UNION-XXXXXX2209",
    ifscCode: "UBIN0530123",
    parcelId: "MP-IND-008841",
    areaHa: 1.120,
    assessedAmount: 9800000,
    solatiumAmount: 9800000,
    interestAmount: 784000,
    totalPayable: 20384000,
    disbursedAmount: 0,
    paymentMode: "PFMS-DBT",
    status: "bank-processing",
  },
];

export interface RnrBeneficiary {
  id: string;
  familyHead: string;
  aadhaarMasked: string;
  project: string;
  state: string;
  district: string;
  village: string;
  category: "SC" | "ST" | "OBC" | "General";
  displacedStatus: "Physically Displaced" | "Economically Affected";
  entitlements: {
    housingAllotment: "Allotted" | "Constructed" | "In Progress" | "Not Opted";
    housingPlotNumber?: string;
    subsistenceGrant: "Disbursed" | "Scheduled" | "Pending";
    subsistenceAmount: number;
    jobOrAnnuity: "Job Guarantee" | "One-Time Cash Option" | "Monthly Annuity";
    resettlementAllowance: "Disbursed" | "Pending";
  };
  grievanceCount: number;
  status: "Completed" | "In Progress" | "Grievance Pending" | "Verification Underway";
}

export const SAMPLE_RNR_BENEFICIARIES: RnrBeneficiary[] = [
  {
    id: "RNR-UP-0012",
    familyHead: "Ram Lal Maurya",
    aadhaarMasked: "XXXX-XXXX-3829",
    project: "Eastern Freight Connectivity Corridor",
    state: "Uttar Pradesh",
    district: "Varanasi",
    village: "Rampur Khas",
    category: "OBC",
    displacedStatus: "Physically Displaced",
    entitlements: {
      housingAllotment: "Allotted",
      housingPlotNumber: "Plot #42, Model Resettlement Colony B",
      subsistenceGrant: "Disbursed",
      subsistenceAmount: 36000,
      jobOrAnnuity: "Job Guarantee",
      resettlementAllowance: "Disbursed",
    },
    grievanceCount: 0,
    status: "Completed",
  },
  {
    id: "RNR-UP-0013",
    familyHead: "Santosh Bind",
    aadhaarMasked: "XXXX-XXXX-9912",
    project: "Eastern Freight Connectivity Corridor",
    state: "Uttar Pradesh",
    district: "Varanasi",
    village: "Rampur Khas",
    category: "ST",
    displacedStatus: "Physically Displaced",
    entitlements: {
      housingAllotment: "In Progress",
      housingPlotNumber: "Plot #44, Model Resettlement Colony B",
      subsistenceGrant: "Disbursed",
      subsistenceAmount: 50000,
      jobOrAnnuity: "One-Time Cash Option",
      resettlementAllowance: "Pending",
    },
    grievanceCount: 1,
    status: "Grievance Pending",
  },
  {
    id: "RNR-MH-0044",
    familyHead: "Ganesh D. Shinde",
    aadhaarMasked: "XXXX-XXXX-7721",
    project: "Regional Railway Expansion – Pune Node",
    state: "Maharashtra",
    district: "Pune",
    village: "Hadapsar",
    category: "General",
    displacedStatus: "Economically Affected",
    entitlements: {
      housingAllotment: "Not Opted",
      subsistenceGrant: "Disbursed",
      subsistenceAmount: 36000,
      jobOrAnnuity: "Monthly Annuity",
      resettlementAllowance: "Disbursed",
    },
    grievanceCount: 0,
    status: "Completed",
  },
  {
    id: "RNR-KA-0081",
    familyHead: "Hanumantha Nayak",
    aadhaarMasked: "XXXX-XXXX-5521",
    project: "Irrigation Modernisation Scheme – Krishna Basin",
    state: "Karnataka",
    district: "Raichur",
    village: "Kurdi",
    category: "ST",
    displacedStatus: "Physically Displaced",
    entitlements: {
      housingAllotment: "In Progress",
      housingPlotNumber: "Plot #18, Krishna R&R Layout",
      subsistenceGrant: "Scheduled",
      subsistenceAmount: 50000,
      jobOrAnnuity: "Job Guarantee",
      resettlementAllowance: "Pending",
    },
    grievanceCount: 0,
    status: "In Progress",
  },
  {
    id: "RNR-RJ-0039",
    familyHead: "Kailash Dan Charan",
    aadhaarMasked: "XXXX-XXXX-1144",
    project: "Renewable Energy Transmission Corridor",
    state: "Rajasthan",
    district: "Jaisalmer",
    village: "Khuri",
    category: "OBC",
    displacedStatus: "Economically Affected",
    entitlements: {
      housingAllotment: "Not Opted",
      subsistenceGrant: "Scheduled",
      subsistenceAmount: 36000,
      jobOrAnnuity: "One-Time Cash Option",
      resettlementAllowance: "Pending",
    },
    grievanceCount: 0,
    status: "Verification Underway",
  },
];

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerName: string;
  officerRole: string;
  department: string;
  ipHash: string;
  actionCategory: "Security" | "Valuation" | "Workflow Transition" | "Document Upload" | "Compensation";
  actionTitle: string;
  actionDetails: string;
  signatureHash: string;
  status: "verified" | "flagged";
}

export const SAMPLE_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-2026-89101",
    timestamp: "28 Aug 2026, 09:15 AM",
    officerName: "Rajeev Singhal, IAS",
    officerRole: "District Collector",
    department: "District Land Acquisition Cell, Varanasi",
    ipHash: "103.24.188.XX (NIC-GoI Gateway)",
    actionCategory: "Workflow Transition",
    actionTitle: "Section 19 Declaration Approved",
    actionDetails: "Promoted Eastern Freight Corridor project to Stage 7 (Survey & Measurement) following zero unresolved objections.",
    signatureHash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    status: "verified",
  },
  {
    id: "AUD-2026-89102",
    timestamp: "28 Aug 2026, 08:30 AM",
    officerName: "Dr. Sunita Rao, AI Specialist",
    officerRole: "Ministry Analyst",
    department: "Department of Land Resources (DoLR), New Delhi",
    ipHash: "164.100.12.XX (NIC National Cloud)",
    actionCategory: "Valuation",
    actionTitle: "Valuation Anomaly Flag Review",
    actionDetails: "Reviewed AI anomaly flag score 62 on parcel UP-AGR-004821 and requested circle rate re-verification from Sub-Registrar.",
    signatureHash: "SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    status: "verified",
  },
  {
    id: "AUD-2026-89103",
    timestamp: "27 Aug 2026, 04:12 PM",
    officerName: "Manoj Kumar Verma",
    officerRole: "Land Acquisition Officer",
    department: "DoLR Field Office, Varanasi",
    ipHash: "103.24.188.XX (NIC-GoI Gateway)",
    actionCategory: "Compensation",
    actionTitle: "PFMS Direct Benefit Transfer Released",
    actionDetails: "Disbursed ₹65,72,000 via PFMS-DBT to Ramesh Chandra Patel for parcel UP-AGR-004821.",
    signatureHash: "SHA256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    status: "verified",
  },
  {
    id: "AUD-2026-89104",
    timestamp: "27 Aug 2026, 02:45 PM",
    officerName: "Vikramaditya Rathore",
    officerRole: "Field Officer",
    department: "NHAI Survey Unit, Jaisalmer",
    ipHash: "117.218.44.XX (Field Survey PWA)",
    actionCategory: "Document Upload",
    actionTitle: "Geotagged Survey Photos Uploaded",
    actionDetails: "Uploaded 8 geotagged survey plots for parcel RJ-ARD-002187 with GPS coordinates matching ULPIN spatial boundary.",
    signatureHash: "SHA256:8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    status: "verified",
  },
  {
    id: "AUD-2026-89105",
    timestamp: "26 Aug 2026, 11:20 AM",
    officerName: "Pradeep Joshi",
    officerRole: "PIA Officer",
    department: "National Highways Authority of India (NHAI)",
    ipHash: "14.139.112.XX (NHAI Corporate VPN)",
    actionCategory: "Workflow Transition",
    actionTitle: "New Project Proposal Submitted",
    actionDetails: "Registered proposal BS-PROP-2026-00124 (Western Bypass Highway – Stage 2 Pilot) with DPR and spatial KML boundary files.",
    signatureHash: "SHA256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    status: "verified",
  },
];

export const ALL_SYSTEM_DOCUMENTS: Document[] = [
  { id: "DOC-001", name: "Social Impact Assessment Report - Eastern Corridor", type: "SIA", version: "v2.1", date: "12 Jan 2026", uploaderRole: "SIA Agency", size: "4.2 MB", url: "#" },
  { id: "DOC-002", name: "Gazette Notification Under Section 11(1) - UP", type: "Section 11", version: "v1.0", date: "03 Feb 2026", uploaderRole: "State Government", size: "1.1 MB", url: "#" },
  { id: "DOC-003", name: "Objection Register and Collector Hearing Record", type: "Objections", version: "v1.2", date: "15 Mar 2026", uploaderRole: "District Collector", size: "2.8 MB", url: "#" },
  { id: "DOC-004", name: "Geospatial Boundary Survey and Measurement Log", type: "GIS Survey", version: "v1.0", date: "20 Apr 2026", uploaderRole: "Field Officer", size: "8.4 MB", url: "#" },
  { id: "DOC-005", name: "Section 19 Final Gazette Declaration", type: "Section 19", version: "v1.0", date: "10 Jun 2026", uploaderRole: "State Government", size: "1.8 MB", url: "#" },
  { id: "DOC-006", name: "Final Award Statement and Solatium Calculation", type: "Award Statement", version: "v1.0", date: "10 Jul 2026", uploaderRole: "Land Acquisition Officer", size: "3.1 MB", url: "#" },
  { id: "DOC-007", name: "Rehabilitation and Resettlement (R&R) Scheme Plan", type: "R&R Scheme", version: "v1.1", date: "15 Jul 2026", uploaderRole: "District Collector", size: "4.6 MB", url: "#" },
  { id: "DOC-008", name: "Physical Possession Certificate (Stage 10)", type: "Possession Certificate", version: "v1.0", date: "18 Aug 2026", uploaderRole: "District Collector", size: "1.4 MB", url: "#" },
  { id: "DOC-009", name: "DPR & Land Requirement Matrix - Western Bypass", type: "DPR", version: "v1.0", date: "20 Aug 2026", uploaderRole: "PIA Officer", size: "14.2 MB", url: "#" },
  { id: "DOC-010", name: "Solar Park Transmission Corridor - Feasibility Study", type: "Feasibility", version: "v2.0", date: "22 Aug 2026", uploaderRole: "PIA Officer", size: "9.8 MB", url: "#" },
];

