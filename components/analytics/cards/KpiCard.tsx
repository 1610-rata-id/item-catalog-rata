import { Card, CardContent } from "@/components/ui/card";
import { CircleHelp, LucideIcon, TrendingUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  change?: string;
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  iconBg,
  change = "+12.45%",
}: KpiCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}/15`}
            >
              <Icon
                className={`h-6 w-6 ${iconBg.replace("bg-", "text-")}`}
              />
            </div>

            <span className="text-sm font-medium text-slate-500">
              {title}
            </span>
          </div>

          <CircleHelp className="h-4 w-4 text-slate-400" />
        </div>

        {/* Value */}
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h2>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            vs Bulan lalu
          </span>

          <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}