"use client";

import { SAMPLE_STATES } from "@/lib/mockData";
import { MapPin } from "lucide-react";

// Simplified India SVG map panel with state markers
// This is a schematic representation for prototype purposes.
// Production would use PostGIS / Bhuvan / DILRMP layers.

const STATE_POSITIONS: Record<string, { x: number; y: number }> = {
  UP: { x: 55, y: 32 },
  RJ: { x: 32, y: 35 },
  MH: { x: 38, y: 55 },
  KA: { x: 38, y: 68 },
  MP: { x: 48, y: 48 },
};

interface MapPanelProps {
  highlightedState?: string;
  onStateClick?: (stateId: string) => void;
  compact?: boolean;
}

export default function MapPanel({ highlightedState, onStateClick, compact = false }: MapPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#1F3864]">National Project Map</h3>
          <p className="text-[10px] text-gray-400">Schematic state markers · Illustrative sample data</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />On track</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />In progress</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />At risk</span>
        </div>
      </div>

      <div className="relative">
        {/* Schematic India outline SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full"
          style={{ height: compact ? "180px" : "280px" }}
          aria-label="Schematic map of India with active project state markers"
          role="img"
        >
          {/* Simplified India silhouette */}
          <path
            d="M35,8 L42,6 L55,8 L65,10 L72,15 L76,22 L74,30 L70,35 L72,42 L68,50 L62,58 L55,70 L50,80 L46,90 L44,95 L42,90 L38,80 L36,72 L30,62 L25,55 L22,48 L20,40 L22,32 L25,25 L28,18 L32,12 Z"
            fill="#EAF0F8"
            stroke="#D1D5DB"
            strokeWidth="0.8"
          />
          {/* Kashmir */}
          <path
            d="M40,6 L42,4 L48,3 L54,5 L58,7 L55,8 L42,6 Z"
            fill="#EAF0F8"
            stroke="#D1D5DB"
            strokeWidth="0.6"
          />
          {/* Northeast */}
          <path
            d="M65,22 L72,20 L78,22 L80,28 L76,30 L72,28 L68,25 Z"
            fill="#EAF0F8"
            stroke="#D1D5DB"
            strokeWidth="0.6"
          />

          {/* State markers */}
          {SAMPLE_STATES.map((state) => {
            const pos = STATE_POSITIONS[state.id];
            if (!pos) return null;
            const isHighlighted = highlightedState === state.id;
            const dotColor = state.status === "on-track" ? "#138808" : state.status === "at-risk" ? "#F59E0B" : "#3B82F6";

            return (
              <g
                key={state.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: onStateClick ? "pointer" : "default" }}
                onClick={() => onStateClick?.(state.id)}
                role="button"
                aria-label={`${state.name}: ${state.activeProjects} active projects, ${state.possessionPercent}% possession`}
                tabIndex={onStateClick ? 0 : -1}
                onKeyDown={(e) => e.key === "Enter" && onStateClick?.(state.id)}
              >
                {/* Pulse ring for at-risk */}
                {state.status === "at-risk" && (
                  <circle cx="0" cy="0" r="5" fill="none" stroke="#F59E0B" strokeWidth="0.8" opacity="0.5" className="pulse-slow" />
                )}
                {/* Dot */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHighlighted ? 4 : 3}
                  fill={dotColor}
                  opacity={isHighlighted ? 1 : 0.85}
                />
                {/* State label */}
                <text
                  x="4"
                  y="-4"
                  fontSize="3"
                  fill="#1F3864"
                  fontFamily="Inter, sans-serif"
                  fontWeight="600"
                >
                  {state.id}
                </text>
                {/* Project count badge */}
                <text
                  x="4"
                  y="0"
                  fontSize="2.5"
                  fill="#6B7280"
                  fontFamily="Inter, sans-serif"
                >
                  {state.activeProjects} proj
                </text>
              </g>
            );
          })}

          {/* Legend label */}
          <text x="2" y="98" fontSize="2.5" fill="#9CA3AF" fontFamily="Inter, sans-serif">
            Schematic representation · Illustrative sample data for prototype
          </text>
        </svg>

        {/* State detail cards */}
        {!compact && (
          <div className="mt-3 grid grid-cols-1 gap-1.5">
            {SAMPLE_STATES.map((state) => (
              <div
                key={state.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                  highlightedState === state.id
                    ? "border-[#1F3864] bg-[#EAF0F8]"
                    : "border-gray-100 bg-gray-50 hover:bg-[#EAF0F8]"
                }`}
                onClick={() => onStateClick?.(state.id)}
                role="button"
                tabIndex={0}
                aria-label={`${state.name} details`}
                onKeyDown={(e) => e.key === "Enter" && onStateClick?.(state.id)}
              >
                <span className="font-medium text-[#1F3864]">{state.name}</span>
                <div className="flex items-center gap-3 text-gray-500">
                  <span>{state.activeProjects} projects</span>
                  <span>{state.areaNotified.toLocaleString("en-IN")} ha notified</span>
                  <span
                    className="font-semibold"
                    style={{ color: state.possessionPercent >= 60 ? "#138808" : state.possessionPercent >= 40 ? "#B45309" : "#DC2626" }}
                  >
                    {state.possessionPercent}% possession
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
