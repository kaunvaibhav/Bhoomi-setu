# BhoomiSetu — Real-Time National Land Acquisition & Management System

> **Smart India Hackathon 2026 Prototype**


---

## Product Overview

**BhoomiSetu** (भूमि सेतु) — *Bridging Land, Data & Decisions*

BhoomiSetu is a Government of India digital platform proposal that connects Central Ministries, State Governments, District Authorities, Project Implementing Agencies (PIA), Field Officers, and Citizens on one unified system for managing the complete land acquisition lifecycle under the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act)**.

**Country:** Government of India
**Ministry:** Ministry of Rural Development
**Department:** Department of Land Resources (DoLR)
**Problem Statement:** Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support

---

## Key Features

- **National Dashboard** — Real-time KPIs across all states — area notified, acquired, compensation disbursed, and possession progress
- **12-Stage Lifecycle Workflow** — Standardized case routing from Project Proposal through Project Handover with audit trail
- **GIS Visualization** — Interactive real India map using React Leaflet and OpenStreetMap with state-level status markers
- **AI Valuation Anomaly Review** — Screens compensation declared values against comparable transactions and circle rates; flags anomalies for officer review
- **Citizen Case Tracking** — Citizens can look up their case status, compensation details, documents, and next actions by Case ID
- **Role-Based Dashboards** — Ministry, District Collector, PIA, and Citizen views protected by functional authentication
- **Proposal Submission** — 4-step PIA proposal form with document upload
- **Documents and Audit Trail** — Version-controlled document repository with uploader role tracking
- **Alerts and Notifications** — Dashboard alerts for pending actions, milestone risks, and valuation flags

---

## Tech Stack

- **Next.js 16** (App Router) — Framework
- **React 19** — User interface
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling with custom government color tokens
- **Leaflet & React Leaflet** — Interactive GIS mapping
- **Recharts** — Dashboard analytics
- **Framer Motion** — Micro-animations
- **lucide-react** — Modern iconography

---

## Local Setup

```bash
cd bhoomi-setu
npm install
npm run dev
```

Open http://localhost:5000

---

## Demo Flows

### Flow A: Ministry Monitoring
`/` → `/login` → Sign in as Ministry Analyst → `/dashboard` → National Overview

### Flow B: AI Valuation Review
`/dashboard` → `/valuation-review` → Select flagged parcel → Review anomaly metrics

### Flow C: Citizen Transparency
`/` → `/track-case` → Enter `BS-UP-2026-004821` → Full case detail

### Flow D: PIA Proposal
`/login` → Sign in as PIA Officer → `/projects/new` → 4-step form → Submit

---

## Authentication & Prototype Credentials

All dashboards are protected by role-based session authentication and Next.js route protection. Enter the official credentials on `/login`:

| Role | Official Email | Password |
|------|----------------|----------|
| Ministry Analyst | `ministry@bhoomisetu.gov.in` | `Ministry@123` |
| District Collector | `collector@bhoomisetu.gov.in` | `Collector@123` |
| PIA Officer | `pia@bhoomisetu.gov.in` | `PIA@123` |
| Citizen / Land Owner | `citizen@bhoomisetu.gov.in` | `Citizen@123` |

**Sample Case ID for Public Lookup:** `BS-UP-2026-004821`

---

## Customizing Data

Edit `/lib/mockData.ts`:

```typescript
export const SIH_META = {
  problemStatementId: "PS-26016",  
  teamName: "HardForkers",
};
```

---

*Prototype for Smart India Hackathon 2026 · Ministry of Rural Development · Department of Land Resources (DoLR) · Government of India*
