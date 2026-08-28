import Link from "next/link";
import { CheckCircle, AlertTriangle, Database, Shield, Network, Brain, Layers, ArrowRight } from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <TopUtilityBar />
      <MainNavbar />
      <main id="main-content" className="bg-white min-h-screen">
        {/* Hero */}
        <div className="bg-[#1F3864] text-white py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Government of India · Ministry of Rural Development · Department of Land Resources (DoLR)
            </span>
            <h1 className="text-4xl font-bold mt-2 mb-3">Bridging Land, Data &amp; Decisions</h1>
            <p className="text-blue-200 text-base leading-relaxed max-w-2xl">
              A Smart India Hackathon 2026 prototype proposing a unified national platform for the complete land acquisition lifecycle under the RFCTLARR Act, 2013.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

          {/* Problem → Solution → Impact */}
          <section aria-labelledby="problem-sol-heading">
            <h2 id="problem-sol-heading" className="text-2xl font-bold text-[#1F3864] mb-6">Problem → Solution → Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  label: "Problem",
                  color: "#FFF1F1",
                  border: "#EF4444",
                  content: "Land acquisition in India involves multiple authorities, physical files, and fragmented systems. Delays in award, disputes over compensation, and lack of status visibility for land owners create inefficiencies and trust deficits.",
                },
                {
                  label: "Solution",
                  color: "#EAF0F8",
                  border: "#1F3864",
                  content: "BhoomiSetu proposes a unified digital platform connecting Ministry of Rural Development (DoLR), State Governments, District Authorities, PIAs, Field Officers, and Citizens on one workflow system—with GIS mapping, AI-assisted valuation review, and real-time progress monitoring.",
                },
                {
                  label: "Impact",
                  color: "#EAF7EE",
                  border: "#138808",
                  content: "Faster case processing, earlier detection of compensation anomalies, transparent citizen communication, and a national data view enabling evidence-based policy decisions for land acquisition programmes.",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border-l-4 p-5 text-sm leading-relaxed" style={{ backgroundColor: item.color, borderLeftColor: item.border }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: item.border }}>{item.label}</p>
                  <p className="text-gray-700">{item.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why fragmented processes cause delays */}
          <section aria-labelledby="why-heading">
            <h2 id="why-heading" className="text-2xl font-bold text-[#1F3864] mb-4">Why Fragmented Processes Create Delays</h2>
            <ul className="space-y-2">
              {[
                "Each state and district maintains separate records—no single view of national acquisition progress exists.",
                "Compensation valuation relies on manual market assessment without systematic comparable-transaction verification.",
                "Land owners have no digital interface to track case status, leading to uncertainty and objections.",
                "Project agencies cannot easily monitor multi-district, multi-stage land acquisition milestones in one place.",
                "Document movement between authorities is primarily physical, creating delays and loss of audit trail.",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* What BhoomiSetu Solves */}
          <section aria-labelledby="solves-heading">
            <h2 id="solves-heading" className="text-2xl font-bold text-[#1F3864] mb-4">What BhoomiSetu Proposes to Solve</h2>
            <ul className="space-y-2">
              {[
                "A single, nationally accessible workflow system for all 12 acquisition stages.",
                "Role-based dashboards for Ministry of Rural Development / DoLR, State Governments, District Collectors, PIAs, Field Officers, and Citizens.",
                "AI-assisted compensation valuation screening before award finalisation.",
                "GIS-enabled parcel tracking integrated with DILRMP and Bhuvan.",
                "Citizen transparency portal for case status and document access.",
                "Audit trail for every action, document, and decision in the lifecycle.",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-[#138808] flex-shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* AI Valuation Module */}
          <section className="bg-purple-50 border border-purple-200 rounded-2xl p-6" aria-labelledby="ai-heading">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={20} className="text-purple-600" />
              <h2 id="ai-heading" className="text-xl font-bold text-purple-800">AI Valuation Anomaly Detection</h2>
            </div>
            <p className="text-sm text-purple-700 leading-relaxed mb-4">
              The AI module, applied at Stage 8 (Award Declaration), screens declared compensation values against:
            </p>
            <ul className="space-y-1.5 text-sm text-purple-700">
              {["Comparable registered transactions within a configurable radius and time window", "Circle rates from State IGRS portals", "Infrastructure announcement proximity (highways, railways)", "Land type, irrigation status, and area factors", "Historical award patterns for similar parcels"].map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-purple-100 rounded-xl p-3">
              <p className="text-xs text-purple-800 font-semibold mb-1">Important Disclaimer</p>
              <p className="text-xs text-purple-700 leading-relaxed">
                The AI module provides a decision-support signal only. It does not determine, alter, or override the legally payable compensation amount. All final decisions remain with the authorised Land Acquisition Officer under the RFCTLARR Act, 2013.
              </p>
            </div>
          </section>

          {/* Phase-wise Implementation */}
          <section aria-labelledby="impl-heading">
            <h2 id="impl-heading" className="text-2xl font-bold text-[#1F3864] mb-4">Phase-wise Implementation Plan</h2>
            <div className="space-y-3">
              {[
                { phase: "Phase 1 (0–6 months)", title: "Core Platform", desc: "Workflow engine, RBAC, document repository, basic dashboards, Ministry of Rural Development / DoLR and District Collector interfaces." },
                { phase: "Phase 2 (6–12 months)", title: "GIS Integration", desc: "DILRMP and Bhuvan integration, parcel-level tracking, GIS-enabled map views, field officer mobile interface." },
                { phase: "Phase 3 (12–18 months)", title: "AI Module & Compensation", desc: "IGRS data integration, AI valuation screening deployment, PFMS compensation tracking, citizen portal launch." },
                { phase: "Phase 4 (18–24 months)", title: "Scale & Interoperability", desc: "National rollout, Aadhaar-linked citizen login, DigiLocker integration, MIS reports, audit dashboard." },
              ].map((p) => (
                <div key={p.phase} className="flex gap-4 bg-[#EAF0F8] rounded-xl p-4">
                  <div className="flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#1F3864] bg-white px-2 py-1 rounded-lg border border-[#1F3864]/20">{p.phase}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1F3864] mb-0.5">{p.title}</p>
                    <p className="text-xs text-gray-600">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Data and Integration Assumptions */}
          <section aria-labelledby="data-heading">
            <h2 id="data-heading" className="text-2xl font-bold text-[#1F3864] mb-4">Data & Integration Assumptions</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
              <p className="text-sm font-semibold text-amber-800 mb-2">Prototype Disclaimer</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                The prototype uses sample data and simulated integrations. Production deployment would require secure interoperability with authorised land records, registration, payment, identity, and geospatial systems. All data in this prototype is illustrative.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ["SVAMITVA", "Village land records", "Prototype"],
                ["DILRMP", "Digital land records", "Prototype"],
                ["Bhuvan / ISRO", "GIS and cadastral", "Prototype"],
                ["PFMS", "Payment tracking", "Prototype"],
                ["DigiLocker", "Document verification", "Prototype"],
                ["State IGRS", "Registration data", "Prototype"],
              ].map(([name, desc, badge]) => (
                <div key={name} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs font-bold text-[#1F3864]">{name}</p>
                  <p className="text-[10px] text-gray-500 mb-1">{desc}</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold">{badge} integration</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="flex gap-4 flex-wrap pt-4 border-t border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-[#1F3864] text-white font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors text-sm">
              Explore Dashboard <ArrowRight size={15} />
            </Link>
            <Link href="/valuation-review" className="flex items-center gap-2 px-5 py-2.5 border border-[#1F3864] text-[#1F3864] font-semibold rounded-xl hover:bg-[#EAF0F8] transition-colors text-sm">
              AI Valuation Review <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
