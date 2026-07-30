"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Top Spend Items
        </CardTitle>

        <CardDescription>
          Highest procurement spending by item
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">

          {topSpendItems.map((item, index) => {
            const percent =
              (item.total_spend / maxSpend) * 100;

            return (
              <div
                key={item.item_name}
                className="rounded-xl border border-slate-100 p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-10
                        w-10
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

                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {item.item_name}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {formatNumber(item.total_qty)} Qty •{" "}
                        {formatNumber(item.transaction_count)} Transactions
                      </p>
                    </div>

                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatCompactCurrency(item.total_spend)}
                    </p>
                  </div>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
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
      </CardContent>
    </Card>
  );
}