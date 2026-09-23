interface TopVendor {
  vendor: string;
  final_score: number;
  status: "Good" | "Enough" | "Bad";
}

interface EvaluationTopVendorsProps {
  vendors: TopVendor[];
}

function getStatusClass(
  status: TopVendor["status"]
) {
  if (status === "Good") {
    return "bg-emerald-100 text-emerald-600";
  }

  if (status === "Enough") {
    return "bg-amber-100 text-amber-600";
  }

  return "bg-red-100 text-red-600";
}

export default function EvaluationTopVendors({
  vendors,
}: EvaluationTopVendorsProps) {
  const maxScore = 3;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Top 10 Vendors by Performance Score
        </h2>

        <span className="text-slate-400">
          ⓘ
        </span>
      </div>

      <div className="mt-5">

        <div className="grid grid-cols-[36px_minmax(130px,1fr)_minmax(180px,2fr)_55px] gap-3 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-900 dark:bg-blue-500/10 dark:text-blue-300">
          <span>#</span>
          <span>Vendor Name</span>
          <span>Final Score (0 – 3.00)</span>
          <span className="text-right">Score</span>
        </div>

        <div className="mt-2 space-y-1">
          {vendors.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              Tidak ada data vendor.
            </div>
          ) : (
            vendors.map((vendor, index) => {
              const width =
                Math.max(
                  0,
                  Math.min(
                    100,
                    (vendor.final_score /
                      maxScore) *
                      100
                  )
                );

              return (
                <div
                  key={`${vendor.vendor}-${index}`}
                  className="grid grid-cols-[36px_minmax(130px,1fr)_minmax(180px,2fr)_55px] items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                >
                  <span className="text-sm text-slate-500">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                      {vendor.vendor}
                    </span>
                  </div>

                  <div className="relative h-4 overflow-hidden rounded-sm bg-slate-200 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-sm bg-blue-600 transition-all"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {vendor.final_score.toFixed(
                      2
                    )}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}