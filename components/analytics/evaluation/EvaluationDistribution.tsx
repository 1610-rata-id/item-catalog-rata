import { Info } from "lucide-react";

interface EvaluationDistributionProps {
  good: number;
  enough: number;
  bad: number;
  averageScore: number;
}

function Donut({
  good,
  enough,
  bad,
}: {
  good: number;
  enough: number;
  bad: number;
}) {
  const total = good + enough + bad;

  if (total === 0) {
    return (
      <div className="flex h-52 w-52 items-center justify-center rounded-full border-[28px] border-slate-100 dark:border-neutral-800">
        <div className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total Vendors
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            0
          </p>
        </div>
      </div>
    );
  }

  const goodPct = (good / total) * 100;
  const enoughPct = (enough / total) * 100;

  const gradient = `conic-gradient(
    #10b981 0 ${goodPct}%,
    #f59e0b ${goodPct}% ${goodPct + enoughPct}%,
    #ef4444 ${goodPct + enoughPct}% 100%
  )`;

  return (
    <div
      className="relative flex h-52 w-52 items-center justify-center rounded-full"
      style={{ background: gradient }}
    >
      <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white dark:bg-neutral-900">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Total Vendors
        </span>

        <span className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {total.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  count,
  total,
}: {
  color: string;
  label: string;
  count: number;
  total: number;
}) {
  const percentage =
    total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />

        <span className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-sm font-semibold text-slate-800 dark:text-slate-200">
        {count.toLocaleString("id-ID")}{" "}
        <span className="font-medium text-slate-500 dark:text-slate-400">
          ({percentage.toFixed(0)}%)
        </span>
      </span>
    </div>
  );
}

export default function EvaluationDistribution({
  good,
  enough,
  bad,
  averageScore,
}: EvaluationDistributionProps) {
  const total = good + enough + bad;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Distribution of Vendor Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overview of vendor performance classification.
          </p>
        </div>

        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      </div>

      {/* CONTENT */}

      <div className="mt-6 grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_1fr]">

        {/* DONUT */}

        <div className="flex justify-center">
          <Donut
            good={good}
            enough={enough}
            bad={bad}
          />
        </div>

        {/* LEGEND + SCORE */}

        <div className="space-y-5">

          <LegendRow
            color="#10b981"
            label="Good"
            count={good}
            total={total}
          />

          <LegendRow
            color="#f59e0b"
            label="Enough"
            count={enough}
            total={total}
          />

          <LegendRow
            color="#ef4444"
            label="Bad"
            count={bad}
            total={total}
          />

          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
            <p className="text-sm font-semibold text-[#1D63B3] dark:text-blue-400">
              Average Vendor Score
            </p>

            <p className="mt-1 text-3xl font-bold tracking-tight text-[#1D63B3] dark:text-blue-300">
              {averageScore.toFixed(2)}

              <span className="ml-1 text-lg font-medium text-[#1D63B3]/70 dark:text-blue-300/70">
                / 3.00
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTNOTE */}

      <p className="mt-5 text-xs text-slate-400 dark:text-slate-500">
        Score range: 0.00 – 3.00. Final Score mengikuti nilai evaluasi dari source.
      </p>
    </section>
  );
}