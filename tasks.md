# BhoomiSetu - Project Implementation Roadmap & Tasks

This document contains the step-by-step, phase-by-phase roadmap required to fully build and productionize **BhoomiSetu** (Real-Time National Land Acquisition & Management System) based on the 12-stage workflow, AI/ML valuation anomaly engine, and architectural requirements.

---

## Phase 1: Foundation, DB Schemas & Environment Setup

- [ ] **1.1 Relational Database Setup (PostgreSQL with PostGIS)**
  - [ ] Initialize PostgreSQL instance and install `postgis` extension.
  - [ ] Design and run migrations for tables: `users`, `projects`, `land_parcels` (with spatial `geometry` type for boundaries), `workflow_history`, and `audit_logs`.
  - [ ] Add indexing on parcel coordinates, project status, and foreign key relationships.

- [ ] **1.2 Document Database Setup (MongoDB)**
  - [ ] Initialize MongoDB cluster for document management.
  - [ ] Design document schema for storing raw documents (e.g., Section 11 notices, objections, survey photos, digital certificates) and version histories.

- [ ] **1.3 Next.js Backend & API Setup**
  - [ ] Configure database connectors (Prisma/Kysely or mongoose/pg pool).
  - [ ] Set up Next.js API Routes / Server Actions scaffold.
  - [ ] Implement global error handling and request-validation middlewares.

- [ ] **1.4 AI/ML Python Microservice Setup**
  - [ ] Create a Python (FastAPI/Flask) microservice directory structure.
  - [ ] Set up a virtual environment and configure dependencies (`scikit-learn`, `PyOD`, `pandas`, `numpy`, `fastapi`, `uvicorn`).
  - [ ] Define basic endpoint templates for checking anomalies: `/api/v1/valuation/check`.

---

## Phase 2: User Roles, RBAC & Authentication

- [x] **2.1 Implement Secure Authentication**
  - [x] Set up `next-auth` (Auth.js) or custom JWT-based authentication.
  - [ ] Implement single sign-on (SSO) interfaces for government officials.
  - [x] Mock DigiLocker / Aadhaar identity verification flow for Citizen portals.

- [x] **2.2 Role-Based Access Control (RBAC)**
  - [x] Define permissions matrix for roles:
    - `ministry`: Read-only national dashboards, analytics, alerts.
    - `state`: State-wide project monitoring, inter-district coordination.
    - `district`: Case processing, approving valuations, issuing declarations, possession records.
    - `pia` (Project Implementing Agency): Submitting proposals, uploading feasibility reports.
    - `field`: Fetching survey forms, uploading geotagged photographs.
    - `citizen`: Case tracking, objection submission, compensation status lookup.
  - [x] Secure pages and API endpoints using middleware based on token roles.

---

## Phase 3: The 12-Stage Digital Workflow Engine (Stages 1 - 6)

- [x] **3.1 Stage 1: Project Proposal Submission**
  - [x] Create a comprehensive multi-step form for PIA (NHAI, Railways, etc.) to submit new proposals.
  - [x] Implement secure PDF upload for feasibility reports, maps, and land requirements list.
  - [x] Generate unique Proposal Reference Numbers (e.g., `BS-PROP-2026-00124`).

- [x] **3.2 Stage 2: Preliminary Scrutiny**
  - [x] Build a checklist-based dashboard for District/State officers to check completeness and budget.
  - [x] Create workflow transitions: Approve -> Move to SIA; Reject -> Back to PIA with comments.

- [x] **3.3 Stage 3: Social Impact Assessment (SIA)**
  - [x] Develop interactive interface for SIA agencies to upload assessment reports.
  - [x] Build a sub-feature to capture affected/displaced families counts and preliminary asset statistics.
    - *Note: Completed SIA report upload, affected families census tracking, and baseline asset metrics.*

- [x] **3.4 Stage 4: Section 11 Notification**
  - [x] Implement an e-Notification generator that dynamically populates public notices.
  - [x] Create notification approval flow for State Land Acquiring Authorities.
  - [x] Build a public portal page showing current active notifications.

- [x] **3.5 Stage 5: Objection Hearing Scheduler**
  - [x] Create a citizen portal page allowing affected land owners to log objections (with document upload).
  - [x] Build an interactive scheduler for District Collectors to set hearing dates and log objection outcomes.

- [x] **3.6 Stage 6: Declaration (Section 19)**
  - [x] Create declaration publisher interface for the State Government.
  - [x] Set up audit log triggers to record approval timestamp and officer signature hashes.

---

## Phase 4: GIS Spatial Mapping & Field Surveys (Stage 7)

- [x] **4.1 GIS Layer & Geospatial Visualization**
  - [x] Integrate Leaflet.js / Mapbox with the dashboard.
  - [x] Enable rendering of GeoJSON polygons representing land parcels.
  - [x] Integrate ISRO Bhuvan satellite basemap layer for realistic geographic reference.
    - *Note: Added base map switching (OSM, ISRO Bhuvan Satellite via WMS, and Esri Satellite backup) and an overlay of styled land parcel polygons with hover effects and detailed popups.*

- [ ] **4.2 Stage 7: Land Survey & Measurement**
  - [ ] Build a responsive mobile view (Progressive Web App or React Native interface) for Field Survey Officers.
  - [ ] Implement GPS location capture with high-accuracy indicators.
  - [ ] Create a photo upload module with EXIF data verification (checking if photo coordinates match the parcel bounds).

---

## Phase 5: AI/ML Valuation & Award Declaration (Stage 8)

- [ ] **5.1 Compensation Valuation Anomaly Detection Engine**
  - [ ] Gather/Synthesize historical datasets: transaction deeds, circle rates, distances to roads/cities.
  - [ ] Train an Isolation Forest or supervised regression model to predict expected land value ranges.
  - [ ] Build API endpoint logic: Accept land parcel attributes, calculate anomaly scores (0-100), and output explainability notes (e.g., "Declared value is 40% below 12 comparable sales within 2km").

- [x] **5.2 Stage 8: Award Declaration UI**
  - [ ] Build the Compensation Calculator dashboard for Land Acquisition Officers.
  - [x] Embed the AI/ML valuation checker. When an officer inputs an assessed value, call the API and display flags ("No Concern" vs "Flagged - Recommend Manual Review").
  - [ ] Log officer overrides or reviews to the audit database for accountability.

---

## Phase 6: Compensation, Possession & R&R (Stages 9 - 11)

- [ ] **6.1 Stage 9: Compensation Disbursement Integration**
  - [ ] Design mock APIs for PFMS (Public Financial Management System) direct bank transfers.
  - [ ] Build a compensation ledger tracking: Total Assessed, Total Disbursed, Pending, and Bank Reference IDs.

- [ ] **6.2 Stage 10: Physical Possession Handover**
  - [ ] Implement possession certificate generator (automatically sign and generate PDF).
  - [ ] Create upload portal for field officers to submit geotagged photos of physical site handover.

- [ ] **6.3 Stage 11: Rehabilitation & Resettlement (R&R) Tracker**
  - [ ] Build an family-wise list for tracking resettlement progress.
  - [ ] Track R&R benefits: alternate housing allotted, job guarantees, subsistence allowances, and cash packages.

---

## Phase 7: Analytics, Dashboards & Reporting (Stage 12)

- [x] **7.1 Executive National Dashboard**
  - [x] Create national high-level KPIs: Area Notified vs Acquired, Compensation Disbursed (₹ Cr), Affected Families count.
  - [x] Implement visual charts (bar charts, time-series line graphs, and progress bars).
  - [x] Add map widgets showing heatmaps of active projects across states.

- [ ] **7.2 Project Drill-Down & MIS Reports**
  - [ ] Build multi-level filtering: State -> District -> Specific Infrastructure Project.
  - [ ] Add "Export to Excel/PDF" utility for MIS reports.
  - [ ] Display predictive timeline alerts (e.g., "Project X likely to miss possession deadline by 45 days").

---

## Phase 8: Compliance, Security & DevOps

- [ ] **8.1 Data Protection & Privacy Compliance**
  - [ ] Mask personal identifiable information (PII) of citizens (Aadhaar, bank accounts) in compliance with the DPDP Act 2023.
  - [ ] Implement end-to-end data encryption (AES-256 at rest, TLS 1.3 in transit).

- [ ] **8.2 Immutable Audit Trail**
  - [ ] Develop database triggers to capture every state change, document upload, and approval action with timestamps and user-IDs.
  - [ ] Create a visual "History log" for every project and parcel.

- [ ] **8.3 DevOps & CI/CD Setup**
  - [ ] Write Dockerfiles for Next.js app and Python AI/ML microservice.
  - [ ] Build GitHub Actions configuration for automated linting, type-checking, and test runs.
  - [ ] Plan deployment scripts for hosting (e.g., NIC/MeghRaj cloud or general cloud providers).
