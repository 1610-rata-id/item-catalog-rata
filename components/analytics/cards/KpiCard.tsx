import { Card, CardContent } from "@/components/ui/card";

import {
  CircleHelp,
  LucideIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;

  growth?: number | null;
  comparisonLabel?: string;
}

function getGradient(title: string) {
  switch (title) {
    case "Total Spend":
      return "from-blue-600 to-indigo-600";

    case "Transactions":
      return "from-violet-600 to-indigo-600";

    case "Purchase Orders":
      return "from-teal-600 to-emerald-600";

    case "Purchase Requests":
      return "from-amber-500 to-orange-600";

    case "Active Vendors":
      return "from-cyan-600 to-blue-600";

    default:
      return "from-blue-600 to-indigo-600";
  }
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  iconBg,
  growth = null,
  comparisonLabel = "No comparison",
}: KpiCardProps) {
  const hasGrowth =
    growth !== null &&
    growth !== undefined;

  const isPositive =
    (growth ?? 0) >= 0;

  const gradient = getGradient(title);

  return (
    <Card
      className={`group min-h-[150px] overflow-hidden rounded-2xl border-0 bg-gradient-to-br ${gradient} text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
    >
      <CardContent className="p-6">
        {/* Header */}

        <div className="flex items-start justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Icon className="h-8 w-8 text-white" />
            </div>

            <span className="text-base font-semibold text-white">
              {title}
            </span>
          </div>

          <CircleHelp className="mt-1 h-4 w-4 shrink-0 text-white/60" />
        </div>

        {/* Value */}

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-white">
          {value}
        </h2>

        {/* Footer */}

        <div className="mt-5">
          <div className="space-y-1">
            {hasGrowth ? (
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  isPositive
                    ? "text-emerald-200"
                    : "text-red-200"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}

                {isPositive ? "+" : ""}
                {growth.toFixed(2)}%
              </div>
            ) : (
              <div className="text-sm text-white/70">
                —
              </div>
            )}

            <div className="text-xs leading-4 text-white/70">
              Compared to
              <br />
              {comparisonLabel.replace("vs ", "")}
            </div>
          </div>

          <CircleHelp className="mt-2 h-4 w-4 text-white/50 transition-colors hover:text-white/80" />
        </div>
      </CardContent>
    </Card>
  );
}