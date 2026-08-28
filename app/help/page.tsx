"use client";

import { useState } from "react";
import { CheckCircle, MessageSquare, Phone, ChevronDown, ChevronUp, HelpCircle, FileText } from "lucide-react";
import TopUtilityBar from "@/components/TopUtilityBar";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";
import ToastNotification, { useToast } from "@/components/ToastNotification";

const FAQS = [
  { q: "What is BhoomiSetu?", a: "BhoomiSetu is a proposed national digital platform for managing the complete land acquisition lifecycle from project proposal to final possession, connecting all stakeholders in a unified system." },
  { q: "Who can access BhoomiSetu?", a: "The platform is designed for Ministry officials, State Government officers, District Collectors, Project Implementing Agencies, Field Officers, and Citizens/Land Owners — each with a role-appropriate dashboard." },
  { q: "How do I track my land acquisition case?", a: "Citizens can use the 'Track My Land Case' feature on the homepage or at /track-case. Enter your Case ID to view the current stage, compensation status, and available documents." },
  { q: "What is the AI Valuation Review?", a: "The AI module screens declared compensation values against comparable registered transactions and circle rates to flag unusual valuations for officer review. It is a decision-support tool and does not alter legal compensation entitlements." },
  { q: "Is this a real government system?", a: "No. This is a prototype built for Smart India Hackathon 2026. All data is illustrative and no real government APIs are connected. Production deployment would require authorised integrations and security audits." },
  { q: "How do I submit a project proposal as a PIA?", a: "Login as a PIA Officer and navigate to 'Submit New Project Proposal'. Complete the 4-step form with project details, land requirements, and upload the required documents." },
  { q: "What is the 12-stage lifecycle?", a: "BhoomiSetu tracks every case through 12 standardized stages: Project Proposal, Preliminary Scrutiny, SIA, Section 11 Notification, Objection Hearing, Declaration, Survey, Award Declaration (AI check here), Compensation, Possession, R&R, and Project Handover." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#1F3864] pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const { toasts, addToast, dismissToast } = useToast();
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "", type: "general" });
  const [submitted, setSubmitted] = useState(false);

  function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    addToast("success", "Feedback submitted. Thank you for your input!");
  }

  return (
    <>
      <TopUtilityBar />
      <MainNavbar />
      <main id="main-content" className="bg-white min-h-screen">
        {/* Header */}
        <div className="bg-[#EAF0F8] py-10 px-4 border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-semibold text-[#1F3864] uppercase tracking-wider">Support</span>
            <h1 className="text-3xl font-bold text-[#1F3864] mt-1 mb-2">Help & Feedback</h1>
            <p className="text-gray-500 text-sm max-w-xl">Find answers to common questions and share your feedback on the BhoomiSetu prototype.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: FAQs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick contact cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Phone size={18} />, title: "Helpdesk", desc: "Contact district office for case queries", color: "#1F3864" },
                  { icon: <MessageSquare size={18} />, title: "Online Grievance", desc: "Submit grievances through the portal", color: "#138808" },
                  { icon: <FileText size={18} />, title: "User Guide", desc: "Download the system user guide (PDF)", color: "#7C3AED" },
                ].map((c) => (
                  <div key={c.title} className="bg-white border border-gray-100 rounded-xl p-4 shadow-card text-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mx-auto mb-3" style={{ backgroundColor: c.color }}>
                      {c.icon}
                    </div>
                    <p className="text-sm font-semibold text-[#1F3864]">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{c.desc}</p>
                  </div>
                ))}
              </div>

              {/* FAQ section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle size={18} className="text-[#1F3864]" />
                  <h2 className="text-lg font-bold text-[#1F3864]">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-2">
                  {FAQS.map((faq) => (
                    <FAQItem key={faq.q} {...faq} />
                  ))}
                </div>
              </div>

              {/* Prototype notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="text-sm font-bold text-amber-800 mb-2">Prototype Limitations</p>
                <ul className="space-y-1 text-xs text-amber-700">
                  <li>• All data is illustrative sample data — not real government records</li>
                  <li>• Government integrations are simulated (SVAMITVA, DILRMP, PFMS, DigiLocker)</li>
                  <li>• GIS data is schematic — not legally accurate cadastral boundaries</li>
                  <li>• AI valuation output is a mock decision-support result</li>
                  <li>• No real authentication or data storage is implemented</li>
                </ul>
                <p className="text-xs text-amber-700 mt-2 font-medium">
                  Production deployment would require authorised APIs, security audits, legal validation, and verified datasets.
                </p>
              </div>
            </div>

            {/* Right: Feedback form */}
            <div>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-5 sticky top-20">
                <h2 className="text-sm font-bold text-[#1F3864] mb-4 flex items-center gap-2">
                  <MessageSquare size={15} />
                  Share Feedback
                </h2>

                {submitted ? (
                  <div className="text-center py-6">
                    <CheckCircle size={32} className="text-[#138808] mx-auto mb-3" />
                    <p className="text-sm font-semibold text-[#1F3864]">Feedback received</p>
                    <p className="text-xs text-gray-500 mt-1">Thank you for helping improve BhoomiSetu.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-[#1F3864] underline">
                      Submit another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3" noValidate>
                    <div>
                      <label htmlFor="fb-name" className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                      <input id="fb-name" type="text" value={feedback.name} onChange={(e) => setFeedback({ ...feedback, name: e.target.value })} placeholder="Your name" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3864] bg-gray-50" />
                    </div>
                    <div>
                      <label htmlFor="fb-email" className="block text-xs font-semibold text-gray-700 mb-1">Email (optional)</label>
                      <input id="fb-email" type="email" value={feedback.email} onChange={(e) => setFeedback({ ...feedback, email: e.target.value })} placeholder="your@email.com" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3864] bg-gray-50" />
                    </div>
                    <div>
                      <label htmlFor="fb-type" className="block text-xs font-semibold text-gray-700 mb-1">Feedback Type</label>
                      <select id="fb-type" value={feedback.type} onChange={(e) => setFeedback({ ...feedback, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3864] bg-gray-50">
                        <option value="general">General Feedback</option>
                        <option value="bug">Bug / Issue Report</option>
                        <option value="feature">Feature Suggestion</option>
                        <option value="accessibility">Accessibility Issue</option>
                        <option value="ux">UX / Design Feedback</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="fb-message" className="block text-xs font-semibold text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                      <textarea id="fb-message" required rows={4} value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} placeholder="Share your feedback..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3864] bg-gray-50 resize-none" />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-[#1F3864] text-white font-semibold rounded-xl hover:bg-[#2A4A8A] transition-colors text-sm">
                      Submit Feedback
                    </button>
                    <p className="text-[10px] text-gray-400 text-center">Prototype demo — feedback is not stored</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
