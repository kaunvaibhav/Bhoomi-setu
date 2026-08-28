import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  accent?: string;
  isLoading?: boolean;
  badge?: string;
}

export default function KpiCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  accent = "#1F3864",
  isLoading = false,
  badge,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3 shadow-card" aria-busy="true">
        <div className="h-3 w-1/3 rounded shimmer" />
        <div className="h-8 w-2/3 rounded shimmer" />
        <div className="h-2 w-1/2 rounded shimmer" />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 shadow-card card-hover"
      role="region"
      aria-label={`KPI: ${title}`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{title}</p>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accent + "15" }}
            aria-hidden="true"
          >
            <span style={{ color: accent }}>{icon}</span>
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-2xl font-bold text-[#1F3864] leading-tight">{value}</p>
      </div>

      <div className="flex items-center justify-between">
        {subtitle && (
          <p className="text-xs text-gray-500 leading-snug">{subtitle}</p>
        )}
        {trend && trendValue && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ml-auto ${
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-gray-500"
            }`}
            aria-label={`Trend: ${trendValue}`}
          >
            {trend === "up" && <TrendingUp size={12} />}
            {trend === "down" && <TrendingDown size={12} />}
            {trend === "neutral" && <Minus size={12} />}
            {trendValue}
          </div>
        )}
      </div>

      {badge && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 italic">{badge}</span>
        </div>
      )}
    </div>
  );
}
