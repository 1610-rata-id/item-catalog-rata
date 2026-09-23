interface VendorRiskRow {
  id: number;
  vendor: string;
  material: string;
  single_source: boolean;
  frequent_backorder: boolean;
  risk_level: "Low" | "Medium" | "High";
}

interface VendorRiskOverviewProps {
  risks: VendorRiskRow[];
}

function RiskBadge({
  value,
}: {
  value: boolean;
}) {
  return (
    <span
      className={`
        inline-flex
        min-w-[58px]
        justify-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium

        ${
          value
            ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        }
      `}
    >
      {value ? "Ya" : "Tidak"}
    </span>
  );
}

function RiskLevelBadge({
  level,
}: {
  level: "Low" | "Medium" | "High";
}) {
  const styles = {
    Low: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    Medium:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    High: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <span
      className={`
        inline-flex
        min-w-[64px]
        justify-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${styles[level]}
      `}
    >
      {level}
    </span>
  );
}

export default function VendorRiskOverview({
  risks,
}: VendorRiskOverviewProps) {
  return (
    <section className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

      {/* HEADER */}

      <div className="flex shrink-0 items-start justify-between px-5 pb-4 pt-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3l8 4v5c0 4.8-3.4 8.8-8 10-4.6-1.2-8-5.2-8-10V7l8-4z" />
              <path d="M12 8v5" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Vendor Risk Overview
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Risk matrix vendor berdasarkan master data procurement
            </p>
          </div>

        </div>

        <button
          type="button"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Lihat Semua →
        </button>

      </div>

      {/* TABLE */}

      <div className="min-h-0 flex-1 overflow-hidden px-5 pb-5">
        <div className="h-full overflow-y-auto rounded-xl border border-slate-200 dark:border-neutral-800">

          <table className="w-full min-w-[680px] border-collapse text-sm">

            <thead className="sticky top-0 z-10 bg-blue-50 dark:bg-blue-950/40">

              <tr className="border-b border-slate-200 dark:border-neutral-800">

                <th className="w-12 px-2 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                  No
                </th>

                <th className="min-w-[150px] px-3 py-3 text-left text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Nama Vendor
                </th>

                <th className="min-w-[130px] px-3 py-3 text-left text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Material
                </th>

                <th className="min-w-[120px] px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Single Source
                </th>

                <th className="min-w-[145px] px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Frequent Backorder
                </th>

                <th className="min-w-[100px] px-3 py-3 text-center text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Risk Level
                </th>

              </tr>

            </thead>

            <tbody>

              {risks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Tidak ada risk matrix untuk vendor yang dipilih.
                  </td>
                </tr>
              ) : (
                risks.map((risk, index) => (
                  <tr
                    key={risk.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-white/[0.03]"
                  >

                    <td className="px-2 py-3 text-center text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-3 py-3 font-medium text-slate-700 dark:text-slate-200">
                      {risk.vendor}
                    </td>

                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {risk.material}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <RiskBadge
                        value={
                          risk.single_source
                        }
                      />
                    </td>

                    <td className="px-3 py-3 text-center">
                      <RiskBadge
                        value={
                          risk.frequent_backorder
                        }
                      />
                    </td>

                    <td className="px-3 py-3 text-center">
                      <RiskLevelBadge
                        level={
                          risk.risk_level
                        }
                      />
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>
    </section>
  );
}