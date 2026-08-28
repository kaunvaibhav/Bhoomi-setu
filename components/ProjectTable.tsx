"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ExternalLink, ArrowRight } from "lucide-react";
import { type Project } from "@/lib/mockData";
import StatusBadge from "./StatusBadge";
import { formatArea, formatCurrency, getStageName, truncate } from "@/lib/utils";

interface ProjectTableProps {
  projects: Project[];
  isLoading?: boolean;
}

type SortKey = "name" | "state" | "status" | "possessionPercent" | "currentStage";

export default function ProjectTable({ projects, isLoading }: ProjectTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...projects].sort((a, b) => {
    let av: string | number = a[sortKey] as string | number;
    let bv: string | number = b[sortKey] as string | number;
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortAsc ? -1 : 1;
    if (av > bv) return sortAsc ? 1 : -1;
    return 0;
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  function SortBtn({ col }: { col: SortKey }) {
    return sortKey === col ? (
      sortAsc ? <ChevronUp size={12} className="inline ml-0.5" /> : <ChevronDown size={12} className="inline ml-0.5" />
    ) : null;
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="h-4 w-1/4 rounded shimmer" />
        </div>
        <table className="w-full">
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50">
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-3 rounded shimmer" style={{ width: `${50 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1F3864]">Active Projects</h3>
        <span className="text-xs text-gray-400">{projects.length} projects · Illustrative sample data</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Project list">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-[#1F3864]" onClick={() => handleSort("name")}>
                Project <SortBtn col="name" />
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-[#1F3864]" onClick={() => handleSort("state")}>
                State <SortBtn col="state" />
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Land Notified</th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Current Stage</th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-[#1F3864]" onClick={() => handleSort("possessionPercent")}>
                Possession <SortBtn col="possessionPercent" />
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-[#1F3864]" onClick={() => handleSort("status")}>
                Status <SortBtn col="status" />
              </th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((project) => (
              <tr key={project.id} className="border-b border-gray-50 table-row-hover">
                <td className="px-4 py-3">
                  <div className="font-medium text-[#1F3864] text-xs leading-tight">{truncate(project.name, 35)}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{project.id}</div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{project.state}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EAF0F8] text-[#1F3864] font-medium">
                    {project.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{formatArea(project.landNotified)}</td>
                <td className="px-4 py-3">
                  <div className="text-[10px] font-medium text-gray-700">{project.currentStage}/12</div>
                  <div className="text-[10px] text-gray-500">{getStageName(project.currentStage)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${project.possessionPercent}%`,
                          backgroundColor: project.possessionPercent >= 70 ? "#138808" : project.possessionPercent >= 40 ? "#F59E0B" : "#EF4444",
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-600">{project.possessionPercent}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1F3864] hover:text-[#2A4A8A] transition-colors"
                    aria-label={`View details for ${project.name}`}
                  >
                    View <ArrowRight size={11} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
