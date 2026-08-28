// 12-Stage Land Acquisition Lifecycle
// Based on the Right to Fair Compensation and Transparency in Land Acquisition,
// Rehabilitation and Resettlement Act, 2013.
// Illustrative prototype data only.

export interface WorkflowStage {
  id: number;
  label: string;
  shortLabel: string;
  description: string;
  responsibleAuthority: string;
  typicalDuration: string;
  keyActivities: string[];
  isAiCheckpoint?: boolean;
  aiCheckpointNote?: string;
}

export type StageStatus = "completed" | "active" | "pending" | "blocked";

export interface StageProgress {
  stageId: number;
  status: StageStatus;
  completedDate?: string;
  notes?: string;
  nextAction?: string;
  documents?: string[];
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 1,
    label: "Project Proposal",
    shortLabel: "Proposal",
    description: "Project Implementing Agency submits a formal land acquisition proposal with project details, land requirements, and preliminary feasibility data.",
    responsibleAuthority: "Project Implementing Agency",
    typicalDuration: "2–4 weeks",
    keyActivities: [
      "Submit land requirement statement",
      "Upload preliminary project report",
      "Provide administrative approval copy",
    ],
  },
  {
    id: 2,
    label: "Preliminary Scrutiny",
    shortLabel: "Scrutiny",
    description: "District authority reviews the proposal for completeness and eligibility. Any deficiencies are communicated to the PIA for rectification.",
    responsibleAuthority: "District Collector",
    typicalDuration: "3–6 weeks",
    keyActivities: [
      "Verify proposal documents",
      "Check land use compatibility",
      "Issue query or acceptance",
    ],
  },
  {
    id: 3,
    label: "Social Impact Assessment",
    shortLabel: "SIA",
    description: "An independent SIA is conducted to assess the nature and extent of impact on affected families, livelihoods, and communities.",
    responsibleAuthority: "State Government / SIA Agency",
    typicalDuration: "6–12 weeks",
    keyActivities: [
      "Conduct community consultations",
      "Enumerate affected families",
      "Prepare SIA report and R&R plan",
    ],
  },
  {
    id: 4,
    label: "Section 11 Notification",
    shortLabel: "Notification",
    description: "Government issues a preliminary notification under Section 11 of RFCTLARR Act 2013, initiating the formal land acquisition process.",
    responsibleAuthority: "State Government",
    typicalDuration: "2–4 weeks",
    keyActivities: [
      "Publish notification in Official Gazette",
      "Notify affected land owners",
      "Commence land parcel demarcation",
    ],
  },
  {
    id: 5,
    label: "Objection Hearing",
    shortLabel: "Objection",
    description: "Affected persons may file objections. The Collector hears and disposes of objections within the statutory time frame.",
    responsibleAuthority: "District Collector",
    typicalDuration: "4–8 weeks",
    keyActivities: [
      "Receive written objections",
      "Conduct public hearing",
      "Record and dispose objections",
    ],
  },
  {
    id: 6,
    label: "Declaration",
    shortLabel: "Declaration",
    description: "After objections are resolved, government issues a Declaration under Section 19, confirming the land is needed for a public purpose.",
    responsibleAuthority: "State Government / Appropriate Government",
    typicalDuration: "2–4 weeks",
    keyActivities: [
      "Issue Section 19 declaration",
      "Publish in Official Gazette",
      "Initiate award proceedings",
    ],
  },
  {
    id: 7,
    label: "Survey and Measurement",
    shortLabel: "Survey",
    description: "Revenue and field officers conduct a formal survey, demarcate boundaries, and record parcel-wise data for each affected plot.",
    responsibleAuthority: "Land Acquisition Officer / Field Officer",
    typicalDuration: "6–10 weeks",
    keyActivities: [
      "Geo-tag parcel boundaries",
      "Record land class and area",
      "Identify and verify land owners",
    ],
  },
  {
    id: 8,
    label: "Award Declaration",
    shortLabel: "Award",
    description: "The Collector determines the compensation amount for each parcel and issues a formal award. AI valuation check is performed before finalisation.",
    responsibleAuthority: "Land Acquisition Collector",
    typicalDuration: "8–16 weeks",
    keyActivities: [
      "Assess market value and multiplier",
      "AI anomaly screening of declared values",
      "Issue formal award under Section 26",
    ],
    isAiCheckpoint: true,
    aiCheckpointNote: "AI valuation anomaly detection is performed at this stage before compensation is finalised.",
  },
  {
    id: 9,
    label: "Compensation Disbursement",
    shortLabel: "Compensation",
    description: "Compensation, solatium, and other statutory payments are disbursed to eligible land owners through PFMS or designated banking channels.",
    responsibleAuthority: "Land Acquisition Collector / Treasury",
    typicalDuration: "4–12 weeks",
    keyActivities: [
      "Verify bank account details",
      "Process payment through PFMS",
      "Issue payment certificates",
    ],
  },
  {
    id: 10,
    label: "Possession",
    shortLabel: "Possession",
    description: "After compensation is paid, the government takes formal possession of the acquired land and hands it over to the requiring body.",
    responsibleAuthority: "District Collector / Requiring Body",
    typicalDuration: "2–6 weeks",
    keyActivities: [
      "Issue possession notice",
      "Take physical possession",
      "Hand over to requiring body",
    ],
  },
  {
    id: 11,
    label: "Rehabilitation & Resettlement",
    shortLabel: "R&R",
    description: "Entitled displaced families receive resettlement benefits including housing, livelihood support, and other provisions per the R&R plan.",
    responsibleAuthority: "State Government / District Authority",
    typicalDuration: "Ongoing (12–36 months)",
    keyActivities: [
      "Implement R&R plan",
      "Disburse R&R entitlements",
      "Monitor resettlement progress",
    ],
  },
  {
    id: 12,
    label: "Project Handover",
    shortLabel: "Handover",
    description: "Acquired land is formally registered and transferred to the requiring body. Case is closed in the system after all obligations are met.",
    responsibleAuthority: "Land Acquisition Collector / PIA",
    typicalDuration: "2–4 weeks",
    keyActivities: [
      "Execute conveyance deed",
      "Update land records",
      "Close case in BhoomiSetu",
    ],
  },
];

// Generate stage progress for a given current stage
export function generateStageProgress(currentStage: number, status: string): StageProgress[] {
  return WORKFLOW_STAGES.map((stage) => {
    if (stage.id < currentStage) {
      return {
        stageId: stage.id,
        status: "completed" as StageStatus,
        completedDate: getCompletedDate(stage.id),
        notes: "Completed successfully",
      };
    } else if (stage.id === currentStage) {
      return {
        stageId: stage.id,
        status: "active" as StageStatus,
        nextAction: stage.keyActivities[0],
        notes: status === "delayed" ? "Behind schedule" : status === "at-risk" ? "Monitor closely" : "In progress",
      };
    } else {
      return {
        stageId: stage.id,
        status: "pending" as StageStatus,
      };
    }
  });
}

function getCompletedDate(stageId: number): string {
  const dates: Record<number, string> = {
    1: "12 Oct 2025",
    2: "04 Nov 2025",
    3: "22 Jan 2026",
    4: "12 Feb 2026",
    5: "28 Mar 2026",
    6: "15 Apr 2026",
    7: "10 Jun 2026",
    8: "—",
    9: "—",
    10: "—",
    11: "—",
    12: "—",
  };
  return dates[stageId] || "—";
}
