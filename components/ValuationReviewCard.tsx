"use client";

import { Brain, AlertTriangle, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { formatCurrency, getAnomalyColor, getAnomalyLabel } from "@/lib/utils";

interface ValuationParcel {
  parcelId: string;
  project: string;
  state: string;
  landType: string;
  declaredValue: number;
  expectedRangeLow: number;
  expectedRangeHigh: number;
  anomalyScore: number;
  flag: string;
  reviewStatus: string;
}

interface ValuationReviewCardProps {
  parcel: ValuationParcel;
  onSelect: (parcelId: string) => void;
  isSelected?: boolean;
}

export default function ValuationReviewCard({ parcel, onSelect, isSelected }: ValuationReviewCardProps) {
  const scoreColor = getAnomalyColor(parcel.anomalyScore);
  const scoreLabel = getAnomalyLabel(parcel.anomalyScore);
  const isBelowRange = parcel.declaredValue < parcel.expectedRangeLow;
  const isAboveRange = parcel.declaredValue > parcel.expectedRangeHigh;
  const deviationPct = isBelowRange
    ? Math.round(((parcel.expectedRangeLow - parcel.declaredValue) / parcel.expectedRangeLow) * 100)
    : isAboveRange
    ? Math.round(((parcel.declaredValue - parcel.expectedRangeHigh) / parcel.expectedRangeHigh) * 100)
    : 0;

  return (
    <div
      className={`bg-white rounded-xl border shadow-card p-4 cursor-pointer transition-all card-hover ${
        isSelected ? "border-[#1F3864] ring-2 ring-[#1F3864] ring-opacity-20" : "border-gray-100 hover:border-gray-200"
      }`}
      onClick={() => onSelect(parcel.parcelId)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Valuation review for parcel ${parcel.parcelId}, anomaly score ${parcel.anomalyScore}`}
      onKeyDown={(e) => e.key === "Enter" && onSelect(parcel.parcelId)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-bold text-[#1F3864] font-mono">{parcel.parcelId}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{parcel.project}</p>
          <p className="text-[10px] text-gray-400">{parcel.state} · {parcel.landType}</p>
        </div>
        {/* Anomaly score ring */}
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border-4 font-bold text-white text-sm"
            style={{ borderColor: scoreColor, backgroundColor: scoreColor }}
            aria-label={`Anomaly score: ${parcel.anomalyScore} out of 100`}
          >
            {parcel.anomalyScore}
          </div>
          <p className="text-[9px] font-semibold mt-0.5" style={{ color: scoreColor }}>{scoreLabel}</p>
        </div>
      </div>

      {/* Value comparison */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-[10px] text-gray-500 mb-0.5">Declared Value</p>
          <p className="text-xs font-bold text-gray-800">{formatCurrency(parcel.declaredValue, "lakh")}</p>
        </div>
        <div className="rounded-lg p-2" style={{ backgroundColor: isBelowRange ? "#FFF1F1" : isAboveRange ? "#FFF7E8" : "#EAF7EE" }}>
          <p className="text-[10px] text-gray-500 mb-0.5">Expected Range</p>
          <p className="text-xs font-bold" style={{ color: isBelowRange ? "#DC2626" : isAboveRange ? "#B45309" : "#138808" }}>
            {formatCurrency(parcel.expectedRangeLow, "lakh")} – {formatCurrency(parcel.expectedRangeHigh, "lakh")}
          </p>
        </div>
      </div>

      {/* Deviation indicator */}
      {deviationPct > 0 && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium mb-3" style={{ color: isBelowRange ? "#DC2626" : "#B45309" }}>
          {isBelowRange ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
          <span>{deviationPct}% {isBelowRange ? "below" : "above"} expected range</span>
        </div>
      )}

      {/* Flag & status */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={11} style={{ color: scoreColor }} aria-hidden="true" />
          <span className="text-[10px] text-gray-500">{parcel.flag}</span>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: parcel.reviewStatus === "Reviewed" ? "#EAF7EE" : "#FFF7E8",
            color: parcel.reviewStatus === "Reviewed" ? "#138808" : "#B45309",
          }}
        >
          {parcel.reviewStatus}
        </span>
      </div>
    </div>
  );
}
