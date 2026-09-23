"use client";

interface VendorPerformanceRow {
  vendor_name: string;
  total_spend: number | string;
  total_purchase_orders: number | string;
}

interface TopVendorCardProps {
  vendors: VendorPerformanceRow[];
}

function formatCompactCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "Rp 0";
  }

  if (Math.abs(value) >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString(
      "id-ID",
      {
        maximumFractionDigits: 1,
      }
    )} M`;
  }

  if (Math.abs(value) >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString(
      "id-ID",
      {
        maximumFractionDigits: 1,
      }
    )} jt`;
  }

  if (Math.abs(value) >= 1_000) {
    return `Rp ${(value / 1_000).toLocaleString(
      "id-ID",
      {
        maximumFractionDigits: 1,
      }
    )} rb`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function TopVendorCard({
  vendors,
}: TopVendorCardProps) {
  const topVendors = vendors.slice(0, 10);

  const maxSpend =
    topVendors.length > 0
      ? Math.max(
          ...topVendors.map((vendor) =>
            Number(vendor.total_spend)
          )
        )
      : 0;

  /*
   * IMPORTANT:
   * Urutan label sengaja dari 100 -> 0
   * karena flex column justify-between
   * menempatkan item pertama di bagian ATAS.
   */
  const yAxisSteps = [100, 75, 50, 25, 0];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

      {/* HEADER */}

      <div className="flex items-center justify-between px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19V5" />
              <path d="M4 19H21" />
              <path d="M7 16V11" />
              <path d="M12 16V7" />
              <path d="M17 16V4" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Top 10 Vendor
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Vendor dengan total procurement value tertinggi
            </p>
          </div>

        </div>

        <button
          type="button"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
        >
          Lihat Semua →
        </button>

      </div>

      {/* CHART */}

      <div className="px-6 pb-6">

        {topVendors.length === 0 ? (
          <div className="flex h-[330px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-neutral-800">
            Tidak ada data vendor.
          </div>
        ) : (
          <div className="relative">

            {/* Y AXIS */}

            <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[68px]">

              <div className="flex h-full flex-col justify-between">

                {yAxisSteps.map((step) => {
                  const value =
                    (maxSpend * step) / 100;

                  return (
                    <div
                      key={step}
                      className="flex items-center gap-3"
                    >
                      <span className="w-16 shrink-0 text-right text-xs text-slate-400">
                        {formatCompactCurrency(
                          value
                        )}
                      </span>

                      <div className="h-px flex-1 border-t border-dashed border-slate-200 dark:border-neutral-800" />
                    </div>
                  );
                })}

              </div>

            </div>

            {/* BARS */}

            <div className="relative ml-[76px] flex h-[330px] items-end justify-between gap-2 border-b border-slate-200 dark:border-neutral-800">

              {topVendors.map(
                (vendor, index) => {
                  const spend = Number(
                    vendor.total_spend
                  );

                  const percentage =
                    maxSpend > 0
                      ? (spend / maxSpend) * 100
                      : 0;

                  return (
                    <div
                      key={`${vendor.vendor_name}-${index}`}
                      className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    >

                      {/* VALUE */}

                      <div className="mb-2 whitespace-nowrap text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {formatCompactCurrency(
                          spend
                        )}
                      </div>

                      {/* BAR */}

                      <div
                        className="
                          relative
                          w-full
                          max-w-[76px]
                          rounded-t-md
                          bg-blue-600
                          transition-all
                          duration-300
                          group-hover:bg-blue-500
                        "
                        style={{
                          height: `${Math.max(
                            percentage,
                            4
                          )}%`,
                        }}
                      />

                      {/* LABEL */}

                      <div className="mt-3 w-full text-center">
                        <p className="line-clamp-2 text-xs font-medium leading-4 text-slate-700 dark:text-slate-300">
                          {vendor.vendor_name}
                        </p>
                      </div>

                      {/* PO */}

                      <span className="mt-1 text-[10px] text-slate-400">
                        {Number(
                          vendor.total_purchase_orders
                        ).toLocaleString(
                          "id-ID"
                        )}{" "}
                        PO
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>
        )}

      </div>

    </section>
  );
}