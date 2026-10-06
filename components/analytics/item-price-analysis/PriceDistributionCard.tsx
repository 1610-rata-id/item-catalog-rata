"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ItemPriceDistribution } from "@/types/item-price-analysis";

interface PriceDistributionCardProps {
  data: ItemPriceDistribution[];
}

function formatShortCurrency(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)}K`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatRange(
  start: number,
  end: number
) {
  return `${formatShortCurrency(start)} - ${formatShortCurrency(end)}`;
}

export default function PriceDistributionCard({
  data,
}: PriceDistributionCardProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatShortCurrency(item.range_start),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Price Distribution
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Unit price distribution for selected items.
        </p>
      </div>

      {/* CONTENT */}
      {chartData.length === 0 ? (
        <div className="flex h-[270px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No price data available for the selected period.
          </p>
        </div>
      ) : (
        <>
          <div className="h-[270px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 8,
                  right: 8,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  vertical={true}
                />

                <XAxis
                  dataKey="label"
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toLocaleString(
                      "id-ID"
                    )}`,
                    "Transaction Count",
                  ]}
                  labelFormatter={(_, payload) => {
                    const item =
                      payload?.[0]?.payload;

                    if (!item) {
                      return "";
                    }

                    return `Range: ${formatRange(
                      Number(item.range_start),
                      Number(item.range_end)
                    )}`;
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow:
                      "0 4px 12px rgba(15, 23, 42, 0.08)",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="transaction_count"
                  name="Transaction Count"
                  fill="#60A5FA"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* LEGEND */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-[3px] bg-blue-500" />

            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Transaction Count
            </span>
          </div>
        </>
      )}
    </div>
  );
}