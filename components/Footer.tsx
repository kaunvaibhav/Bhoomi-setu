import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-white" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-8xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold text-white mb-1">BhoomiSetu</div>
            <div className="text-xs text-gray-400 mb-3">भूमि सेतु — Bridging Land, Data & Decisions</div>
            <div className="text-xs text-gray-400 leading-relaxed">
              Government of India<br />
              Ministry of Rural Development<br />
              Department of Land Resources
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-[#1F3864] px-2.5 py-1 rounded text-xs text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" aria-hidden="true"></span>
              SIH 2026 Prototype
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Platform</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">National Dashboard</Link></li>
              <li><Link href="/track-case" className="hover:text-white transition-colors">Track My Case</Link></li>
              <li><Link href="/valuation-review" className="hover:text-white transition-colors">Valuation Review</Link></li>
              <li><Link href="/projects/new" className="hover:text-white transition-colors">Submit Proposal</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Architecture</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resources</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About BhoomiSetu</Link></li>
              <li><span className="text-gray-500 text-xs">(Prototype links)</span></li>
            </ul>
            <div className="mt-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Integration Badges</div>
              <div className="flex flex-wrap gap-1.5">
                {["SVAMITVA", "DILRMP", "PFMS", "DigiLocker", "Bhuvan"].map((badge) => (
                  <span key={badge} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1F3864] text-gray-300 border border-gray-600">
                    {badge} <span className="text-[#FF9933]">Prototype</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trust & Compliance */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trust & Design</div>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#FF9933]" aria-hidden="true"></span>
                Role-based access control
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#FF9933]" aria-hidden="true"></span>
                Audit-ready workflow
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#FF9933]" aria-hidden="true"></span>
                GIS-enabled monitoring
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#FF9933]" aria-hidden="true"></span>
                WCAG 2.1 AA (target)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#FF9933]" aria-hidden="true"></span>
                Explainable AI decision support
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-[#1F3864] bg-[#071628]">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <p className="text-[11px] text-gray-500 leading-relaxed text-center">
            <strong className="text-gray-400">Prototype Disclaimer:</strong> Prototype for Smart India Hackathon 2026. All dashboard values and project records shown are illustrative sample data and must be replaced with verified Department of Land Resources data before production deployment. No real official names, photographs, or live government APIs are used.
          </p>
          <p className="text-[10px] text-gray-600 text-center mt-2">
            © 2026 BhoomiSetu — SIH 2026 Prototype &nbsp;·&nbsp; Ministry of Rural Development, Government of India &nbsp;·&nbsp; Last synced: 29 Aug 2026, 11:45 PM (Prototype timestamp)
          </p>
        </div>
      </div>
    </footer>
  );
}
