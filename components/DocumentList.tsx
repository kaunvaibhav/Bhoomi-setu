import { FileText, Download, ExternalLink } from "lucide-react";
import { type Document } from "@/lib/mockData";

const TYPE_COLORS: Record<string, string> = {
  SIA: "#7C3AED",
  Legal: "#1D4ED8",
  Survey: "#0369A1",
  Award: "#B45309",
  Possession: "#138808",
  "R&R": "#065F46",
  DPR: "#1F3864",
  Admin: "#6B7280",
};

interface DocumentListProps {
  documents: Document[];
  compact?: boolean;
}

export default function DocumentList({ documents, compact = false }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No documents uploaded for this record.
      </div>
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Case documents">
      {documents.map((doc) => {
        const typeColor = TYPE_COLORS[doc.type] ?? "#6B7280";

        return (
          <div
            key={doc.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
            role="listitem"
          >
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: typeColor + "15" }}
              aria-hidden="true"
            >
              <FileText size={16} style={{ color: typeColor }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{doc.name}</p>
              {!compact && (
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: typeColor + "15", color: typeColor }}
                  >
                    {doc.type}
                  </span>
                  <span className="text-[10px] text-gray-400">{doc.version}</span>
                  <span className="text-[10px] text-gray-400">{doc.date}</span>
                  <span className="text-[10px] text-gray-400">{doc.uploaderRole}</span>
                  <span className="text-[10px] text-gray-400">{doc.size}</span>
                </div>
              )}
            </div>

            {/* Download button */}
            <a
              href={doc.url}
              aria-label={`Download ${doc.name}`}
              className="flex-shrink-0 p-1.5 rounded text-gray-400 hover:text-[#1F3864] hover:bg-[#EAF0F8] transition-colors"
              onClick={(e) => { e.preventDefault(); /* Demo only */ }}
            >
              <Download size={14} />
            </a>
          </div>
        );
      })}
    </div>
  );
}
