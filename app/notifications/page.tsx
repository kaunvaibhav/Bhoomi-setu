"use client";
import Link from "next/link";
import { Bell, ArrowRight, MapPin, Calendar, FileText, CheckCircle } from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";

const SAMPLE_NOTIFICATIONS = [
  {
    id: "S11-UP-2026-004",
    project: "Eastern Freight Connectivity Corridor",
    district: "Varanasi",
    state: "Uttar Pradesh",
    date: "12 Feb 2026",
    status: "Published",
    details: "Preliminary notification under Section 11(1) for acquisition of 2840 Ha across Ramnagar and Rampur Khas villages.",
  },
  {
    id: "S11-RJ-2026-012",
    project: "Renewable Energy Transmission Corridor",
    district: "Jaisalmer",
    state: "Rajasthan",
    date: "22 Dec 2025",
    status: "Published",
    details: "Acquisition notification of wastelines in Khuri and surrounding region for power evacuation infrastructure.",
  },
  {
    id: "S11-KA-2026-089",
    project: "Irrigation Modernisation Scheme – Krishna Basin",
    district: "Raichur",
    state: "Karnataka",
    date: "12 Apr 2026",
    status: "Published",
    details: "Acquisition notification of agricultural lands in Raichur for canal alignment modernization.",
  },
];

export default function NotificationsPage() {
  return (
    <>
      <TopUtilityBar />
      <MainNavbar />
      <main id="main-content" className="bg-[#F8FAFC] min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F3864] bg-[#EAF0F8] border border-[#1F3864]/20 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Public Portal
            </span>
            <h1 className="text-3xl font-bold text-[#1F3864]">Gazette Land Acquisition Notifications</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Public notifications published under Section 11(1) of the RFCTLARR Act, 2013 by State Land Acquiring Authorities.
            </p>
          </div>

          {/* List */}
          <div className="space-y-4">
            {SAMPLE_NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">{notif.id}</span>
                      <span className="inline-flex items-center gap-1 text-[9px] px-2.5 py-0.5 rounded-full font-bold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle size={10} /> {notif.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#1F3864]">{notif.project}</h2>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin size={13} /> {notif.district}, {notif.state}</span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1"><Calendar size={13} /> Published on: {notif.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Opening PDF Gazette document for ${notif.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition-colors self-start md:self-auto"
                  >
                    <FileText size={13} /> View Gazette Notice (PDF)
                  </button>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  {notif.details}
                </p>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3 text-blue-800">
            <Bell size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Landowner Rights Note</p>
              <p className="text-[11px] text-blue-700 leading-relaxed mt-1">
                Landowners are entitled to log written objections regarding the acquisition, measurements, or rehabilitation elements within 60 days of the publication of the Section 11(1) notification. To file an objection, please use the <Link href="/track-case" className="font-bold underline hover:text-blue-900">Track Case Portal</Link> or visit the District Collector's Land Acquisition cell.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
