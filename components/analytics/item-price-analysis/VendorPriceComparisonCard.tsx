"use client";

import { ItemVendorPriceComparison } from "@/types/item-price-analysis";

interface VendorPriceComparisonCardProps {
  data: ItemVendorPriceComparison[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VendorPriceComparisonCard({
  data,
}: VendorPriceComparisonCardProps) {
  const maxPrice =
    data.length > 0
      ? Math.max(
          ...data.map((item) =>
            Number(item.average_price)
          )
        )
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Vendor Price Comparison
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Average price comparison by vendor for selected items.
        </p>
      </div>

      {/* CONTENT */}
      {data.length === 0 ? (
        <div className="flex h-[250px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No vendor price data available.
          </p>
        </div>
      ) : (
        <div className="max-h-[270px] space-y-4 overflow-y-auto pr-1">
          {data.map((item) => {
            const averagePrice = Number(
              item.average_price
            );

            const percentage =
              maxPrice > 0
                ? (averagePrice / maxPrice) * 100
                : 0;

            return (
              <div
                key={item.vendor_name}
                className="grid grid-cols-[125px_minmax(0,1fr)_125px] items-center gap-3"
              >
                {/* VENDOR */}
                <div
                  className="truncate text-right text-sm font-medium text-slate-700 dark:text-slate-300"
                  title={item.vendor_name}
                >
                  {item.vendor_name}
                </div>

                {/* BAR */}
                <div className="h-5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                    style={{
                      width: `${Math.max(
                        percentage,
                        8
                      )}%`,
                    }}
                  />
                </div>

                {/* PRICE */}
                <div className="whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                  {formatCurrency(averagePrice)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}