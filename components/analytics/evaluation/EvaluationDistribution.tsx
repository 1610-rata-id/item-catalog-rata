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
          <p className="text-xs text-slate-400">
            Total Vendors
          </p>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">
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
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Total Vendors
        </span>

        <span className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
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

        <span className="truncate text-sm text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>

      <span className="shrink-0 text-sm font-semibold text-slate-800 dark:text-slate-200">
        {count} ({percentage.toFixed(0)}%)
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

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Distribution of Vendor Performance
        </h2>

        <span className="text-slate-400">
          ⓘ
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_1fr]">

        <div className="flex justify-center">
          <Donut
            good={good}
            enough={enough}
            bad={bad}
          />
        </div>

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
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Average Vendor Score
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-700 dark:text-blue-300">
              {averageScore.toFixed(2)}
              <span className="ml-1 text-lg font-medium">
                / 3.00
              </span>
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-400">
        Score range: 0.00 – 3.00. Final Score mengikuti nilai evaluasi dari source.
      </p>
    </section>
  );
}