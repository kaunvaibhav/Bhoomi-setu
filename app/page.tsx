"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Clock, AlertTriangle, IndianRupee, Layers, Map, Brain, Users,
  CheckCircle, ArrowRight, ChevronRight, Play, Shield, Database,
  Network, Cpu, FileText, Bell, BarChart3, User, Building2,
  Landmark, HardHat, UserCheck, Wheat,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import TopUtilityBar from "@/components/TopUtilityBar";
import MainNavbar from "@/components/MainNavbar";
import ProcessStepper from "@/components/ProcessStepper";
import Footer from "@/components/Footer";
import { SIH_META, SAMPLE_STATES, SAMPLE_PROJECTS } from "@/lib/mockData";

const NationalFootprintMap = dynamic(
  () => import("@/components/NationalFootprintMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] bg-[#F1F5F9] rounded-xl flex flex-col items-center justify-center border border-slate-200 p-6 text-center">
        <div className="w-8 h-8 border-3 border-[#1F3864] border-t-[#FF9933] rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-[#1F3864]">Loading Interactive India GIS Map...</p>
        <p className="text-[11px] text-gray-400 mt-1">Initializing Leaflet & OpenStreetMap tiles</p>
      </div>
    ),
  }
);

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Section label component
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F3864] bg-[#EAF0F8] border border-[#1F3864]/20 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
      {children}
    </span>
  );
}

// ── SECTION 1: HERO ──────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative bg-gradient-to-br from-[#EAF0F8] via-white to-[#f0f7f0] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #1F3864 0, #1F3864 1px, transparent 0, transparent 60px),
            repeating-linear-gradient(90deg, #1F3864 0, #1F3864 1px, transparent 0, transparent 60px)`,
          backgroundSize: "60px 60px",
          opacity: 0.04,
        }}
      />

      <div className="relative max-w-8xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 border-l-4 border-[#FF9933] pl-3">
                Government of India · Ministry of Rural Development · Department of Land Resources (DoLR)
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-bold text-[#1F3864] mb-4 leading-tight"
            >
              BhoomiSetu
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl font-semibold text-[#333333] mb-3">
              Real-Time National Land Acquisition &amp; Management System
            </motion.p>

            <motion.p variants={fadeUp} className="text-base text-gray-600 leading-relaxed mb-8 max-w-lg">
              Digitizing India's land acquisition lifecycle—from project proposal to final possession—with one unified, transparent, and real-time platform.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/dashboard"
                id="hero-dashboard-btn"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F3864] text-white font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors shadow-md"
              >
                <BarChart3 size={18} />
                Access Official Dashboard
              </Link>
              <Link
                href="/track-case"
                id="hero-track-btn"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#138808] font-semibold rounded-xl border-2 border-[#138808] hover:bg-[#EAF7EE] transition-colors"
              >
                <User size={18} />
                Track My Land Case
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="text-xs text-gray-500 flex items-center gap-2">
              <Shield size={12} className="text-[#1F3864]" />
              Built for coordinated decision-making across Centre, States, Districts, project agencies, and citizens.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
              {["Government of India Prototype", "WCAG 2.1 AA", "Audit-Ready", "GIS-Enabled", "Sample Data"].map((badge) => (
                <span key={badge} className="text-[10px] px-2 py-1 rounded border border-gray-200 text-gray-500 bg-white">
                  {badge}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card-lg overflow-hidden">
              {/* Card header */}
              <div className="bg-[#1F3864] px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">National Acquisition Overview</p>
                  <p className="text-blue-200 text-[10px]">Ministry Analyst (MoRD / DoLR) · Prototype data</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-label="Live indicator" />
              </div>

              {/* Mini KPIs */}
              <div className="grid grid-cols-2 gap-0 border-b border-gray-100">
                {[
                  { label: "Area Notified", value: "24,860 ha", color: "#1F3864" },
                  { label: "Compensation Disbursed", value: "₹8,742 Cr", color: "#138808" },
                  { label: "Possession Progress", value: "71.4%", color: "#1F3864" },
                  { label: "Valuation Flags", value: "38 Awards", color: "#B45309" },
                ].map((kpi, i) => (
                  <div
                    key={kpi.label}
                    className={`px-4 py-3 ${i % 2 === 0 ? "border-r border-gray-100" : ""} ${i < 2 ? "border-b border-gray-100" : ""}`}
                  >
                    <p className="text-[10px] text-gray-500 mb-0.5">{kpi.label}</p>
                    <p className="text-base font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Mini map + progress */}
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Active States</p>
                <div className="space-y-1.5">
                  {SAMPLE_STATES.slice(0, 3).map((state) => (
                    <div key={state.id} className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-600 w-24 truncate">{state.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${state.possessionPercent}%`,
                            backgroundColor: state.possessionPercent >= 60 ? "#138808" : "#F59E0B",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 w-8 text-right">{state.possessionPercent}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 mt-2 text-center">Illustrative sample data for prototype demonstration</p>
              </div>

              {/* Lifecycle mini bar */}
              <div className="bg-[#EAF0F8] px-4 py-2.5 flex items-center gap-2">
                <p className="text-[10px] font-semibold text-[#1F3864]">Eastern Freight Corridor</p>
                <div className="flex-1 flex gap-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 rounded-sm"
                      style={{
                        backgroundColor: i < 8 ? "#138808" : i === 8 ? "#1F3864" : "#E5E7EB",
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-500">9/12</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── SECTION 2: PROBLEM STATS ─────────────────────────────────────────────────
function ProblemSection() {
  const stats = [
    {
      icon: <Clock size={28} className="text-[#B45309]" />,
      value: "2–3 Years",
      label: "Average approval-to-possession timeline",
      sublabel: "Under a fragmented, manual process",
      bg: "#FFF7E8",
    },
    {
      icon: <AlertTriangle size={28} className="text-[#DC2626]" />,
      value: "Valuation Disputes",
      label: "Compensation disagreements can delay project execution",
      sublabel: "A major source of objections and litigation risk",
      bg: "#FFF1F1",
    },
    {
      icon: <IndianRupee size={28} className="text-[#1F3864]" />,
      value: "₹XX,XXX Cr+",
      label: "Compensation pending",
      sublabel: "Illustrative placeholder — requires verified DoLR data",
      bg: "#EAF0F8",
    },
  ];

  return (
    <section id="problem" className="py-16 bg-white" aria-labelledby="problem-heading">
      <div className="max-w-8xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>The Challenge</SectionLabel>
          <h2 id="problem-heading" className="text-3xl font-bold text-[#1F3864] mb-3">
            The Land Acquisition Challenge
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Fragmented records and manual coordination make it difficult to monitor progress, identify delays, and keep affected families informed.
          </p>
          <p className="text-xs text-gray-400 mt-2 italic">All values shown are illustrative sample data.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border border-gray-100 p-6 text-center card-hover"
              style={{ backgroundColor: s.bg }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-card">
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-[#1F3864] mb-2">{s.value}</p>
              <p className="text-sm font-medium text-gray-700 mb-1">{s.label}</p>
              <p className="text-xs text-gray-500 italic">{s.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SECTION 3: OVERVIEW ───────────────────────────────────────────────────────
function OverviewSection() {
  const features = [
    {
      title: "Real-Time Process Tracking",
      desc: "Live status of every case across proposal, notification, award, compensation, and possession stages.",
      icon: <Clock size={20} className="text-[#1F3864]" />,
    },
    {
      title: "GIS-Enabled Mapping",
      desc: "Visualize projects and geo-tagged parcels through a national spatial interface.",
      icon: <Map size={20} className="text-[#138808]" />,
    },
    {
      title: "AI-Powered Valuation Check",
      desc: "Identify unusual compensation valuations before an award is finalized.",
      icon: <Brain size={20} className="text-purple-600" />,
    },
    {
      title: "Role-Based Dashboards",
      desc: "Give each stakeholder a focused view of the information and actions they need.",
      icon: <Users size={20} className="text-[#B45309]" />,
    },
  ];

  return (
    <section id="features" className="py-16 bg-[#EAF0F8]" aria-labelledby="overview-heading">
      <div className="max-w-8xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>Solution Overview</SectionLabel>
            <h2 id="overview-heading" className="text-3xl font-bold text-[#1F3864] mb-4">
              One connected workflow for every stakeholder
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              BhoomiSetu creates a unified digital record for every land acquisition case. From proposal submission and statutory notifications to compensation, possession, and rehabilitation, every stage is routed, tracked, and visible according to the user's role.
            </p>

            <ul className="space-y-2 mb-8">
              {["Standardized workflows across all states and districts", "Real-time national visibility for Ministry and State officers", "GIS-based parcel monitoring with geo-tagged evidence", "Transparent citizen status tracking with plain-language updates"].map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#138808] flex-shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F3864] text-white font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors text-sm"
              >
                Explore the Dashboard <ArrowRight size={15} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F3864] font-semibold rounded-xl border border-[#1F3864] hover:bg-[#EAF0F8] transition-colors text-sm"
              >
                Read the Solution Brief
              </Link>
            </div>
          </motion.div>

          {/* Right: 2x2 grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-card card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF0F8] flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <p className="text-sm font-bold text-[#1F3864] mb-1">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── SECTION 4: KEY COMPONENTS ─────────────────────────────────────────────────
function ComponentsSection() {
  const components = [
    {
      icon: <Cpu size={22} />,
      title: "Workflow Engine",
      desc: "Automates case routing through all 12 acquisition stages with role-based task queues, deadlines, and escalation triggers.",
    },
    {
      icon: <Map size={22} />,
      title: "GIS & Mapping Module",
      desc: "Integrates with Bhuvan and DILRMP to display geo-tagged parcels, project corridors, and acquisition boundaries.",
    },
    {
      icon: <Brain size={22} />,
      title: "AI Valuation Module",
      desc: "Screens declared compensation values against comparable transactions and circle rates to flag anomalies for officer review.",
    },
    {
      icon: <Database size={22} />,
      title: "Secure Document Repository",
      desc: "Stores SIA reports, notifications, award statements, and R&R plans with version control and role-based access.",
    },
    {
      icon: <Bell size={22} />,
      title: "Alerts & Notification Engine",
      desc: "Sends real-time notifications for pending actions, milestone delays, and document approvals via portal, SMS, and email.",
    },
    {
      icon: <BarChart3 size={22} />,
      title: "Analytics & MIS Reports",
      desc: "Generates stage-wise progress reports, cross-state comparison views, and structured exports for policy oversight.",
    },
  ];

  return (
    <section id="components" className="py-16 bg-white" aria-labelledby="components-heading">
      <div className="max-w-8xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Platform Modules</SectionLabel>
          <h2 id="components-heading" className="text-3xl font-bold text-[#1F3864] mb-3">
            Key Components of BhoomiSetu
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A modular platform integrating workflow automation, spatial intelligence, financial tracking, and decision support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {components.map((c, i) => (
            <motion.div
              key={c.title}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-card card-hover group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#EAF0F8] flex items-center justify-center mb-4 text-[#1F3864] group-hover:bg-[#1F3864] group-hover:text-white transition-colors">
                {c.icon}
              </div>
              <h3 className="text-sm font-bold text-[#1F3864] mb-2">{c.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{c.desc}</p>
              <button className="text-[11px] font-semibold text-[#1F3864] hover:underline flex items-center gap-1">
                Learn more <ChevronRight size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SECTION 5: ARCHITECTURE ────────────────────────────────────────────────────
function ArchitectureSection() {
  const layers = [
    {
      title: "User Layer",
      icon: <Users size={24} />,
      color: "#1F3864",
      items: ["Ministry of Rural Development / DoLR", "State Government", "District Authority", "PIA Officer", "Field Officer", "Citizen"],
    },
    {
      title: "Core Platform Layer",
      icon: <Cpu size={24} />,
      color: "#138808",
      items: ["Workflow Engine", "GIS Module", "Compensation Engine", "AI/ML Analytics", "RBAC & Auth", "Alerts Engine"],
    },
    {
      title: "Data Layer",
      icon: <Database size={24} />,
      color: "#7C3AED",
      items: ["Land Parcel DB", "Case Database", "Compensation Ledger", "R&R Records", "Documents Store", "Audit Logs"],
    },
    {
      title: "Integration Layer",
      icon: <Network size={24} />,
      color: "#B45309",
      items: ["SVAMITVA", "DILRMP / Bhuvan", "PFMS", "DigiLocker", "Aadhaar (UIDAI)", "State IGRS Portals"],
    },
  ];

  return (
    <section id="architecture" className="py-16 bg-[#EAF0F8]" aria-labelledby="arch-heading">
      <div className="max-w-8xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>System Design</SectionLabel>
          <h2 id="arch-heading" className="text-3xl font-bold text-[#1F3864] mb-3">
            System Architecture
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A four-layer architecture designed for national scale, security, interoperability, and accountable decision-making.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.title}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-white"
                style={{ backgroundColor: layer.color }}
              >
                {layer.icon}
              </div>
              <h3 className="text-sm font-bold text-[#1F3864] mb-3">{layer.title}</h3>
              <ul className="space-y-1.5">
                {layer.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Security strip */}
        <div className="bg-white rounded-xl border border-[#1F3864]/20 p-4 flex items-start gap-3">
          <Shield size={20} className="text-[#1F3864] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#1F3864] mb-1">Security by design</p>
            <p className="text-xs text-gray-500">
              Role-based access control, field-level encryption, immutable audit history, consent-aware data handling, and accessible interfaces targeting WCAG 2.1 AA.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            {["SVAMITVA", "DILRMP", "PFMS", "DigiLocker", "Bhuvan"].map((b) => (
              <span key={b} className="text-[9px] px-2 py-0.5 rounded border border-gray-200 text-gray-400">
                {b} <span className="text-[#FF9933] font-semibold">Prototype</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SECTION 6: 12-STAGE PROCESS ───────────────────────────────────────────────
function ProcessSection() {
  return (
    <section id="process" className="py-16 bg-white" aria-labelledby="process-heading">
      <div className="max-w-8xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Lifecycle</SectionLabel>
          <h2 id="process-heading" className="text-3xl font-bold text-[#1F3864] mb-3">
            The 12-Stage Land Acquisition Lifecycle
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Every case moves through a standardized, auditable workflow from proposal to project handover.
          </p>
        </motion.div>

        <div className="bg-[#EAF0F8] rounded-2xl p-6">
          <ProcessStepper orientation="horizontal" />
          <div className="mt-4 flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
            <Brain size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-purple-800">
              <strong>Stage 8 — Award Declaration:</strong> AI valuation anomaly detection is performed at this stage before compensation is finalised. The system flags unusual declared values for officer review without overriding legal entitlements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SECTION 7: STAKEHOLDERS ────────────────────────────────────────────────────
function StakeholdersSection() {
  const roles = [
    {
      icon: <Landmark size={24} />,
      title: "Ministry of Rural Development / DoLR",
      desc: "National dashboard, cross-state comparison, policy analytics, and exception monitoring.",
      color: "#1F3864",
    },
    {
      icon: <Building2 size={24} />,
      title: "State Government",
      desc: "State-wide monitoring, inter-district coordination, approvals, and escalation management.",
      color: "#7C3AED",
    },
    {
      icon: <HardHat size={24} />,
      title: "District Collector",
      desc: "Case processing, notifications, objection hearings, possession records, and local coordination.",
      color: "#0369A1",
    },
    {
      icon: <Cpu size={24} />,
      title: "Project Implementing Agency",
      desc: "Submit proposals, upload documents, track milestones, and monitor project-wise progress.",
      color: "#065F46",
    },
    {
      icon: <UserCheck size={24} />,
      title: "Field Officer",
      desc: "Record surveys, capture geo-tagged evidence, verify parcels, and update field status.",
      color: "#92400E",
    },
    {
      icon: <Wheat size={24} />,
      title: "Citizen / Land Owner",
      desc: "Track case status, compensation, documents, objections, grievances, and R&R progress.",
      color: "#138808",
    },
  ];

  return (
    <section id="stakeholders" className="py-16 bg-[#EAF0F8]" aria-labelledby="stakeholders-heading">
      <div className="max-w-8xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Stakeholders</SectionLabel>
          <h2 id="stakeholders-heading" className="text-3xl font-bold text-[#1F3864] mb-3">
            Built for Every Stakeholder
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-card card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-white"
                style={{ backgroundColor: role.color }}
              >
                {role.icon}
              </div>
              <h3 className="text-sm font-bold text-[#1F3864] mb-2">{role.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{role.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SECTION 8: NATIONAL FOOTPRINT MAP ─────────────────────────────────────────
function MapSection() {
  const featured = [
    { name: "Delhi–Varanasi Freight Corridor", state: "Uttar Pradesh", status: "In progress", color: "#3B82F6" },
    { name: "Renewable Energy Transmission Corridor", state: "Rajasthan", status: "At risk", color: "#F59E0B" },
    { name: "Regional Railway Expansion", state: "Maharashtra", status: "On track", color: "#138808" },
    { name: "Irrigation Modernisation Project", state: "Karnataka", status: "In progress", color: "#3B82F6" },
  ];

  return (
    <section id="map" className="py-16 bg-white" aria-labelledby="map-heading">
      <div className="max-w-8xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>National Footprint</SectionLabel>
          <h2 id="map-heading" className="text-3xl font-bold text-[#1F3864] mb-3">
            Land Acquisition Across India
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A national view of active projects, acquisition progress, and regional implementation.
          </p>
          <p className="text-xs text-gray-400 mt-1 italic">Illustrative sample data for prototype demonstration</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Interactive Leaflet India Map */}
          <div className="bg-[#EAF0F8] rounded-2xl p-4 lg:p-5 h-[530px] flex flex-col border border-blue-100 shadow-sm">
            <NationalFootprintMap />
          </div>

          {/* State data + projects */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_STATES.map((state) => (
                <div key={state.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: state.status === "on-track" ? "#138808" : state.status === "at-risk" ? "#F59E0B" : "#3B82F6" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1F3864]">{state.name}</p>
                    <p className="text-[10px] text-gray-500">{state.activeProjects} active projects · {state.areaNotified.toLocaleString("en-IN")} ha notified</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold" style={{ color: state.possessionPercent >= 60 ? "#138808" : "#B45309" }}>{state.possessionPercent}%</p>
                    <p className="text-[10px] text-gray-400">possession</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Featured Projects</p>
              <div className="space-y-2">
                {featured.map((p) => (
                  <div key={p.name} className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-3 py-2.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500">{p.state}</p>
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: p.color }}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SECTION 9: DEMO ────────────────────────────────────────────────────────────
function DemoSection() {
  return (
    <section id="demo" className="py-16 bg-[#EAF0F8]" aria-labelledby="demo-heading">
      <div className="max-w-8xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Live Demo</SectionLabel>
          <h2 id="demo-heading" className="text-3xl font-bold text-[#1F3864] mb-3">
            See BhoomiSetu in Action
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video placeholder */}
          <div className="aspect-video bg-[#1F3864] rounded-2xl relative overflow-hidden flex items-center justify-center group cursor-pointer">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg,white 0,white 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,white 0,white 1px,transparent 0,transparent 40px)" }} aria-hidden="true" />
            <div className="text-center z-10">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                <Play size={28} className="text-white ml-1" />
              </div>
              <p className="text-white font-semibold mb-2">Prototype Walkthrough</p>
              <div className="flex gap-3 justify-center">
                {["Track", "Detect", "Act"].map((label) => (
                  <span key={label} className="text-xs px-3 py-1 rounded-full bg-white/20 text-white font-medium">{label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SIH info card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-8 rounded-full bg-[#FF9933]" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-[#1F3864]">Smart India Hackathon 2026</p>
                <p className="text-xs text-gray-500">Official Submission Information</p>
              </div>
            </div>

            <table className="w-full text-sm" aria-label="SIH submission details">
              <tbody>
                {[
                  ["Organization", SIH_META.organization],
                  ["Department", SIH_META.department],
                  ["Jurisdiction", SIH_META.country],
                  ["Problem Statement ID", SIH_META.problemStatementId],
                  ["Problem Statement", SIH_META.problemStatement],
                  ["Theme", SIH_META.theme],
                  ["Category", SIH_META.category],
                  ["Team ID", SIH_META.teamId],
                  ["Team Name", SIH_META.teamName],
                ].map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-100 last:border-0">
                    <td className="py-2.5 pr-4 text-xs text-gray-500 font-medium whitespace-nowrap">{key}</td>
                    <td className="py-2.5 text-xs font-semibold text-[#1F3864]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5 pt-4 border-t border-gray-100 bg-amber-50 rounded-xl p-3">
              <p className="text-[11px] text-amber-700 leading-snug">
                Update team details in <code className="bg-amber-100 px-1 rounded">lib/mockData.ts</code> → <code className="bg-amber-100 px-1 rounded">SIH_META</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SECTION 10: TRUST & IMPACT ────────────────────────────────────────────────
function TrustSection() {
  const quotes = [
    {
      role: "District Collector",
      statement: "A single case timeline makes it easier to identify pending actions and coordinate with the next authority.",
      icon: <HardHat size={18} />,
      color: "#0369A1",
    },
    {
      role: "Project Implementing Agency Officer",
      statement: "Proposal submission and milestone monitoring become visible instead of being dependent on file movement.",
      icon: <Cpu size={18} />,
      color: "#065F46",
    },
    {
      role: "Ministry Analyst",
      statement: "The national dashboard turns fragmented updates into a comparable decision view.",
      icon: <Landmark size={18} />,
      color: "#1F3864",
    },
    {
      role: "Citizen / Land Owner",
      statement: "I can see what stage my case is at and what action is expected next.",
      icon: <Wheat size={18} />,
      color: "#138808",
    },
  ];

  return (
    <section id="impact" className="py-16 bg-white" aria-labelledby="trust-heading">
      <div className="max-w-8xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Impact</SectionLabel>
          <h2 id="trust-heading" className="text-3xl font-bold text-[#1F3864] mb-3">
            Built for Transparency, Accountability, and Speed
          </h2>
          <p className="text-xs text-gray-400 italic">Illustrative role-based statements for prototype demonstration</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quotes.map((q, i) => (
            <motion.div
              key={q.role}
              className="bg-gray-50 rounded-xl border border-gray-100 p-5 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="text-4xl text-gray-200 font-serif leading-none mb-2">&ldquo;</div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">{q.statement}</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: q.color }}
                >
                  {q.icon}
                </div>
                <p className="text-xs font-semibold text-gray-700">{q.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <TopUtilityBar />
      <MainNavbar />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <OverviewSection />
        <ComponentsSection />
        <ArchitectureSection />
        <ProcessSection />
        <StakeholdersSection />
        <MapSection />
        <DemoSection />
        <TrustSection />

        {/* CTA Banner */}
        <section className="py-12 bg-[#1F3864]" aria-label="Call to action">
          <div className="max-w-8xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to explore BhoomiSetu?
            </h2>
            <p className="text-blue-200 mb-6 text-sm">
              Access the ministry dashboard, review AI valuation flags, or track a citizen case.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/dashboard" className="px-6 py-3 bg-[#FF9933] text-white font-semibold rounded-xl hover:bg-[#E88822] transition-colors text-sm">
                Access Dashboard
              </Link>
              <Link href="/track-case" className="px-6 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/40 hover:bg-white/10 transition-colors text-sm">
                Track My Case
              </Link>
              <Link href="/valuation-review" className="px-6 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/40 hover:bg-white/10 transition-colors text-sm">
                AI Valuation Review
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
