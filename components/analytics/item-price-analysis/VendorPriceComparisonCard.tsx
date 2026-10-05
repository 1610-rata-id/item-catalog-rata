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
      ? Math.max(...data.map((item) => Number(item.average_price)))
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-[16px] font-semibold leading-6 text-[#172B4D] dark:text-white">
          Vendor Price Comparison
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[#6B7A90] dark:text-slate-400">
          Perbandingan harga rata-rata per vendor untuk item yang dipilih.
        </p>
      </div>

      {/* Content */}
      {data.length === 0 ? (
        <div className="flex h-[250px] items-center justify-center">
          <p className="text-sm text-[#6B7A90] dark:text-slate-400">
            Tidak ada data harga vendor.
          </p>
        </div>
      ) : (
        <div className="max-h-[270px] space-y-4 overflow-y-auto pr-1">
          {data.map((item) => {
            const averagePrice = Number(item.average_price);

            const percentage =
              maxPrice > 0
                ? (averagePrice / maxPrice) * 100
                : 0;

            return (
              <div
                key={item.vendor_name}
                className="grid grid-cols-[125px_minmax(0,1fr)_125px] items-center gap-3"
              >
                {/* Vendor */}
                <div
                  className="truncate text-right text-[13px] font-medium text-[#243B5A] dark:text-slate-300"
                  title={item.vendor_name}
                >
                  {item.vendor_name}
                </div>

                {/* Bar */}
                <div className="h-[22px] w-full">
                  <div
                    className="h-full rounded-r-full rounded-l-[2px] bg-gradient-to-r from-[#60A5FA] to-[#007AFF]"
                    style={{
                      width: `${Math.max(percentage, 8)}%`,
                    }}
                  />
                </div>

                {/* Price */}
                <div className="whitespace-nowrap text-[13px] font-medium text-[#243B5A] dark:text-slate-200">
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