"use client";

import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Database, Layers, Cpu, Globe,
  Server, Lock, CheckCircle2, ChevronRight, FileSpreadsheet,
  AlertTriangle, BrainCircuit, ExternalLink, Printer,
} from "lucide-react";

export default function TechnicalApproachSlide() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      {/* Top Utility / Navigation */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-white font-semibold text-slate-300">
            ← Back to BhoomiSetu
          </Link>
          <span>·</span>
          <span>Smart India Hackathon 2026</span>
          <span>·</span>
          <span className="text-amber-400 font-medium">Team 144946: Hard Forkers</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer text-xs"
          >
            <Printer size={13} /> Print / Export Slide
          </button>
        </div>
      </div>

      {/* Presentation Slide Canvas (16:9 Widescreen) */}
      <div className="w-full max-w-7xl aspect-[16/9] bg-[#0A1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative p-6 sm:p-8 text-slate-200">
        {/* Decorative Background Elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 mb-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                System Architecture
              </span>
              <span className="text-[11px] text-slate-400 font-medium">SIH 2026 · Problem Statement SIH26016</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              TECHNICAL APPROACH
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 ml-2 font-mono">
                BhoomiSetu
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-Time National Land Acquisition & Management System · End-to-End Digital Monitoring & Decision Support
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-slate-200">DoLR · Ministry of Rural Development</p>
            <p className="text-[10px] text-slate-400">Govt. of India · RFCTLARR Act, 2013</p>
          </div>
        </div>

        {/* Cross-Cutting AI/ML Intelligence Banner */}
        <div className="relative z-10 mb-4 bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-purple-950/60 border border-purple-500/40 rounded-xl p-3 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-purple-300">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
                <BrainCircuit size={16} className="text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block text-purple-200">
                  AI / ML Intelligence & Decision Support Layer
                </span>
                <span className="text-[10px] text-purple-300/80">
                  Real-time algorithmic surveillance connected across statutory workflow stages
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-900/50 border border-purple-400/30 text-[11px] font-medium text-purple-200 shadow-xs">
                <AlertTriangle size={12} className="text-amber-400" />
                Compensation Anomaly Detection
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-900/50 border border-indigo-400/30 text-[11px] font-medium text-indigo-200 shadow-xs">
                <ShieldCheck size={12} className="text-blue-400" />
                Risk & Bottleneck Prediction
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-900/50 border border-purple-400/30 text-[11px] font-medium text-purple-200 shadow-xs">
                <Cpu size={12} className="text-emerald-400" />
                Valuation Decision Support
              </span>
            </div>
          </div>
        </div>

        {/* 6-Stage Core Technical Pipeline (Grid Flow) */}
        <div className="grid grid-cols-6 gap-3 flex-1 relative z-10 items-stretch">
          {/* Column 1: 6 Role-Based Portals */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 uppercase">
                  Portals
                </span>
                <span className="text-[9px] font-mono text-slate-500">Tier 1</span>
              </div>
              <h2 className="text-xs font-bold text-white mb-2 leading-tight">
                6 Role-Based Portals
              </h2>
              <ul className="space-y-1 text-[10px] text-slate-300">
                <li className="p-1 rounded bg-slate-800/60 border border-slate-700/50">1. Ministry Analyst</li>
                <li className="p-1 rounded bg-slate-800/60 border border-slate-700/50">2. State Officer</li>
                <li className="p-1 rounded bg-slate-800/60 border border-slate-700/50">3. District Collector</li>
                <li className="p-1 rounded bg-slate-800/60 border border-slate-700/50">4. LAO / CALA Unit</li>
                <li className="p-1 rounded bg-slate-800/60 border border-slate-700/50">5. PIA (NHAI/Railways)</li>
                <li className="p-1 rounded bg-blue-950/60 border border-blue-600/40 text-blue-200 font-medium">6. Citizen / Land Owner</li>
              </ul>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[9px] font-mono text-blue-400">Strict RBAC</span>
              <ArrowRight size={13} className="text-slate-500" />
            </div>
          </div>

          {/* Column 2: Next.js + TypeScript Frontend */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                  UI Layer
                </span>
                <span className="text-[9px] font-mono text-slate-500">Tier 2</span>
              </div>
              <h2 className="text-xs font-bold text-white mb-2 leading-tight">
                Next.js & TypeScript
              </h2>
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">App Router (v16)</p>
                  <p className="text-[9px] text-slate-400">Server Components + Turbopack</p>
                </div>
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">Tailwind CSS</p>
                  <p className="text-[9px] text-slate-400">Responsive Govt Design System</p>
                </div>
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">Leaflet + Recharts</p>
                  <p className="text-[9px] text-slate-400">Interactive GIS Maps & Analytics</p>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Next.js · TS</span>
              <ArrowRight size={13} className="text-slate-500" />
            </div>
          </div>

          {/* Column 3: API & Backend Layer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 uppercase">
                  Gateway
                </span>
                <span className="text-[9px] font-mono text-slate-500">Tier 3</span>
              </div>
              <h2 className="text-xs font-bold text-white mb-2 leading-tight">
                API & Backend Layer
              </h2>
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">Server Actions & REST</p>
                  <p className="text-[9px] text-slate-400">Stateless edge mutations</p>
                </div>
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">Zero-Trust RBAC</p>
                  <p className="text-[9px] text-slate-400">Middleware & session encryption</p>
                </div>
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">Tamper-Proof Audit</p>
                  <p className="text-[9px] text-slate-400">Chained event logging</p>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">REST APIs · AWS</span>
              <ArrowRight size={13} className="text-slate-500" />
            </div>
          </div>

          {/* Column 4: 12-Stage Workflow Engine */}
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-3 flex flex-col justify-between hover:border-blue-500/60 transition-all bg-gradient-to-b from-blue-950/20 to-slate-900">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 uppercase">
                  Engine
                </span>
                <span className="text-[9px] font-mono text-slate-500">Tier 4</span>
              </div>
              <h2 className="text-xs font-bold text-white mb-2 leading-tight">
                12-Stage Workflow
              </h2>
              <div className="space-y-1 text-[9px] text-slate-300">
                <div className="p-1 rounded bg-slate-800/80 border border-slate-700/50">Stage 1-2: Proposal & Scrutiny</div>
                <div className="p-1 rounded bg-slate-800/80 border border-slate-700/50">Stage 3-4: SIA & Sec 11 Gazette</div>
                <div className="p-1 rounded bg-slate-800/80 border border-slate-700/50">Stage 5: Sec 15 Hearing</div>
                <div className="p-1 rounded bg-slate-800/80 border border-slate-700/50">Stage 6: Sec 19 Final Decl.</div>
                <div className="p-1 rounded bg-purple-950/60 border border-purple-600/40 text-purple-200">Stage 8: AI Valuation Check</div>
                <div className="p-1 rounded bg-emerald-950/60 border border-emerald-600/40 text-emerald-200">Stage 9-10: PFMS & Handover</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[9px] font-mono text-blue-400">RFCTLARR 2013</span>
              <ArrowRight size={13} className="text-slate-500" />
            </div>
          </div>

          {/* Column 5: Supabase PostgreSQL + GIS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-400 uppercase">
                  Database
                </span>
                <span className="text-[9px] font-mono text-slate-500">Tier 5</span>
              </div>
              <h2 className="text-xs font-bold text-white mb-2 leading-tight">
                Supabase & GIS Data
              </h2>
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">PostgreSQL (Relational)</p>
                  <p className="text-[9px] text-slate-400">Parcels, awards & hearings</p>
                </div>
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">PostGIS Geospatial</p>
                  <p className="text-[9px] text-slate-400">Cadastral boundary polygons</p>
                </div>
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">Encrypted Storage</p>
                  <p className="text-[9px] text-slate-400">Digitally signed gazette PDFs</p>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Supabase · PostGIS</span>
              <ArrowRight size={13} className="text-slate-500" />
            </div>
          </div>

          {/* Column 6: Government Integrations */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-500/20 text-green-400 uppercase">
                  National
                </span>
                <span className="text-[9px] font-mono text-slate-500">Tier 6</span>
              </div>
              <h2 className="text-xs font-bold text-white mb-2 leading-tight">
                Govt. Integrations
              </h2>
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">PFMS Gateway</p>
                  <p className="text-[9px] text-slate-400">DBT solatium fund transfer</p>
                </div>
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">State Bhulekh / RoR</p>
                  <p className="text-[9px] text-slate-400">Land record mutation sync</p>
                </div>
                <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">Bharat Maps & e-Sign</p>
                  <p className="text-[9px] text-slate-400">NIC GIS & Aadhaar e-Sign</p>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">National APIs</span>
              <CheckCircle2 size={13} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Slide Footer / Technology Pills Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Tech Stack:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">Next.js 16</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">TypeScript</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">Supabase / PostgreSQL</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">PostGIS / GeoJSON</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">AI / ML Models</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">REST APIs</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">AWS / Vercel Edge</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <span>16:9 Presentation Format</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium">Production-Grade Prototype</span>
          </div>
        </div>
      </div>
    </div>
  );
}
