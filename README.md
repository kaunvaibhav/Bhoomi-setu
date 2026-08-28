# BhoomiSetu — Real-Time National Land Acquisition & Management System

> **Smart India Hackathon 2026 Prototype**
>
> ⚠️ Prototype disclaimer: All dashboard values, project records, and case data shown are **illustrative sample data** and must be replaced with verified Department of Land Resources data before any production deployment.

---

## Product Overview

**BhoomiSetu** (भूमि सेतु) — *Bridging Land, Data & Decisions*

BhoomiSetu is a Government of India digital platform proposal that connects Central Ministries, State Governments, District Authorities, Project Implementing Agencies (PIA), Field Officers, and Citizens on one unified system for managing the complete land acquisition lifecycle under the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act)**.

**Ministry:** Ministry of Rural Development
**Department:** Department of Land Resources
**Problem Statement:** Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support

---

## Key Features

- **National Dashboard** — Real-time KPIs across all states — area notified, acquired, compensation disbursed, and possession progress
- **12-Stage Lifecycle Workflow** — Standardized case routing from Project Proposal through Project Handover with audit trail
- **GIS Visualization** — Schematic map of national project footprint with state-level status markers
- **AI Valuation Anomaly Review** — Screens compensation declared values against comparable transactions and circle rates; flags anomalies for officer review
- **Citizen Case Tracking** — Citizens can look up their case status, compensation details, documents, and next actions by Case ID
- **Role-Based Dashboards** — Ministry, State, District Collector, PIA, Field Officer, and Citizen views
- **Proposal Submission** — 4-step PIA proposal form with document upload
- **Documents and Audit Trail** — Version-controlled document repository with uploader role tracking
- **Alerts and Notifications** — Dashboard alerts for pending actions, milestone risks, and valuation flags
- **Demo Role Switcher** — Switch between all 6 roles to demonstrate the platform from each perspective

---

## Tech Stack

- **Next.js 14** (App Router) — Framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling with custom government color tokens
- **Recharts** — Dashboard charts (bar, line)
- **Framer Motion** — Subtle animations
- **lucide-react** — Icons
- **Mock API Layer** — Simulated async fetch functions in `/lib/mockApi.ts`

---

## Local Setup

```bash
cd bhoomi-setu
npm install
npm run dev
```

Open http://localhost:3000

---

## Demo Flows

### Flow A: Ministry Monitoring
`/` → `/dashboard` → `/projects/PROJ-UP-001` → Lifecycle + AI callout

### Flow B: AI Valuation Review
`/dashboard` → `/valuation-review` → Select UP-AGR-004821 → View anomaly → Mark as Reviewed

### Flow C: Citizen Transparency
`/` → `/track-case` → Enter `BS-UP-2026-004821` → Full case detail

### Flow D: PIA Proposal
`/login` → Continue as PIA Officer → `/projects/new` → 4-step form → Submit

---

## Demo Access

All demo access requires no real authentication.

| Role | Access |
|------|--------|
| Ministry Analyst | Login page demo button |
| District Collector | Login page demo button |
| PIA Officer | Login page demo button |
| Citizen | Track My Case page |

**Sample Case ID:** `BS-UP-2026-004821`

---

## Customizing Data

Edit `/lib/mockData.ts`:

```typescript
export const SIH_META = {
  problemStatementId: "PS-XXXX",   // Update
  teamId: "SIH-XXXX",             // Update
  teamName: "[Insert Team Name]",  // Update
};
```

---

## Prototype Limitations

- All data is illustrative — not real government records
- Government integrations are simulated (SVAMITVA, DILRMP, PFMS, DigiLocker, Aadhaar)
- GIS data is schematic — not legally accurate cadastral boundaries
- AI valuation output is a mock result
- No real authentication or data persistence

---

## Future Production Requirements

- PostgreSQL with PostGIS for geospatial queries
- JWT authentication with NIC SSO or Aadhaar OTP
- SVAMITVA, DILRMP, Bhuvan, PFMS, DigiLocker, State IGRS integrations
- AI model trained on verified registered transaction data
- VAPT certification and NIC/MeitY cloud hosting
- Audit logging and field-level encryption

---

*Prototype for Smart India Hackathon 2026 · Ministry of Rural Development · Department of Land Resources · Government of India*
