"use client";

import {
  formatCompactCurrency,
  formatNumber,
} from "@/lib/format";

import { TopSpendItem } from "@/types/top-spend-item";

interface TopSpendItemsChartProps {
  topSpendItems: TopSpendItem[];
}

export default function TopSpendItemsChart({
  topSpendItems,
}: TopSpendItemsChartProps) {
  const maxSpend =
    Math.max(...topSpendItems.map((x) => x.total_spend), 1);

  return (
    <div className="w-full">
      <div className="space-y-5">
        {topSpendItems.map((item, index) => {
          const percent =
            (item.total_spend / maxSpend) * 100;

          return (
            <div
              key={`${item.item_code ?? "item"}-${item.item_name}-${index}`}
              className="rounded-xl border border-slate-100 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-600
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    #{index + 1}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {item.item_name}
                    </h4>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatNumber(item.total_qty)} Qty •{" "}
                      {formatNumber(item.transaction_count)} Transactions
                    </p>
                  </div>
                </div>

                <div className="ml-4 shrink-0 text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCompactCurrency(item.total_spend)}
                  </p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-700"
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}