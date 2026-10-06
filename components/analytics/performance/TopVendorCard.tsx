"use client";

import { useState } from "react";

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

function formatFullCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "Rp 0";
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function TopVendorCard({
  vendors,
}: TopVendorCardProps) {
  const [hoveredIndex, setHoveredIndex] =
    useState<number | null>(null);

  const topVendors = vendors.slice(0, 10);

  const maxSpend =
    topVendors.length > 0
      ? Math.max(
          ...topVendors.map((vendor) =>
            Number(vendor.total_spend)
          )
        )
      : 0;

  const yAxisSteps = [100, 75, 50, 25, 0];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

      {/* HEADER */}

      <div className="flex items-center px-6 py-5">

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
              Vendors with the highest procurement spending.
            </p>
          </div>

        </div>

      </div>

      {/* CHART */}

      <div className="px-6 pb-6">

        {topVendors.length === 0 ? (
          <div className="flex h-[330px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-neutral-800">
            No vendor data available.
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

                  const purchaseOrders =
                    Number(
                      vendor.total_purchase_orders
                    );

                  const percentage =
                    maxSpend > 0
                      ? (spend / maxSpend) * 100
                      : 0;

                  /*
                   * Tooltip horizontal positioning:
                   *
                   * First bars  -> align left
                   * Last bars   -> align right
                   * Middle bars -> center
                   */
                  const tooltipHorizontalClass =
                    index === 0
                      ? "left-0"
                      : index >=
                          topVendors.length - 2
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2";

                  /*
                   * Keep tooltip above the bar.
                   *
                   * For very tall bars, move the tooltip
                   * to the upper chart area instead of
                   * letting it collide with the bar.
                   */
                  const barHeight =
                    Math.max(
                      percentage,
                      4
                    );

                  const tooltipTop =
                    barHeight >= 75
                      ? 8
                      : Math.max(
                          8,
                          100 - barHeight - 18
                        );

                  return (
                    <div
                      key={`${vendor.vendor_name}-${index}`}
                      className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      onMouseEnter={() =>
                        setHoveredIndex(index)
                      }
                      onMouseLeave={() =>
                        setHoveredIndex(null)
                      }
                    >

                      {/* TOOLTIP */}

                      {hoveredIndex === index && (
                        <div
                          className={`pointer-events-none absolute z-50 w-[250px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-900 ${tooltipHorizontalClass}`}
                          style={{
                            top: `${tooltipTop}%`,
                          }}
                        >

                          {/* VENDOR NAME */}

                          <p className="mb-3 truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {vendor.vendor_name}
                          </p>

                          {/* TOTAL SPEND */}

                          <div className="flex items-center justify-between gap-4">
                            <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                              Total Spend
                            </span>

                            <span className="whitespace-nowrap text-right text-xs font-semibold text-slate-900 dark:text-white">
                              {formatFullCurrency(
                                spend
                              )}
                            </span>
                          </div>

                          {/* PURCHASE ORDERS */}

                          <div className="mt-2 flex items-center justify-between gap-4">
                            <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                              Purchase Orders
                            </span>

                            <span className="whitespace-nowrap text-right text-xs font-semibold text-slate-900 dark:text-white">
                              {purchaseOrders.toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </div>

                        </div>
                      )}

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
                          height: `${barHeight}%`,
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
                        {purchaseOrders.toLocaleString(
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