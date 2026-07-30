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

import { TopVendor } from "@/types/top-vendor";

interface TopVendorChartProps {
  topVendors: TopVendor[];
}

export default function TopVendorChart({
  topVendors,
}: TopVendorChartProps) {
  const maxSpend = Math.max(
    ...topVendors.map((vendor) => vendor.total_spend),
    1
  );

  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Top Vendors
        </CardTitle>

        <CardDescription>
          Vendors with the highest procurement spending
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          {topVendors.map((vendor, index) => {
            const percentage =
              (vendor.total_spend / maxSpend) * 100;

            return (
              <div
                key={vendor.vendor_name}
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
                        bg-emerald-600
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {vendor.vendor_name}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {formatNumber(vendor.transaction_count)} Transactions
                        {" • "}
                        {formatNumber(vendor.unique_items)} Items
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatCompactCurrency(vendor.total_spend)}
                    </p>
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
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