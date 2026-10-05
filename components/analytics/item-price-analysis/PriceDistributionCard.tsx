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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold leading-6 text-[#172B4D] dark:text-white">
          Price Distribution
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[#6B7A90] dark:text-slate-400">
          Distribusi harga unit untuk item yang dipilih.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[270px] items-center justify-center">
          <p className="text-sm text-[#6B7A90] dark:text-slate-400">
            Tidak ada data harga untuk periode yang dipilih.
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
                  stroke="#E5EAF0"
                  strokeDasharray="3 3"
                  vertical={true}
                />

                <XAxis
                  dataKey="label"
                  tick={{
                    fill: "#6B7A90",
                    fontSize: 11,
                    fontFamily:
                      "Inter, sans-serif",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#6B7A90",
                    fontSize: 11,
                    fontFamily:
                      "Inter, sans-serif",
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
                    "Jumlah Transaksi",
                  ]}
                  labelFormatter={(_, payload) => {
                    const item =
                      payload?.[0]?.payload;

                    if (!item) {
                      return "";
                    }

                    return `Rentang: ${formatRange(
                      Number(item.range_start),
                      Number(item.range_end)
                    )}`;
                  }}
                  contentStyle={{
                    borderRadius: "10px",
                    border:
                      "1px solid #E2E8F0",
                    boxShadow:
                      "0 4px 12px rgba(15, 23, 42, 0.08)",
                    fontFamily:
                      "Inter, sans-serif",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="transaction_count"
                  name="Jumlah Transaksi"
                  fill="#93C5FD"
                  radius={[2, 2, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-[3px] bg-[#3B82F6]" />

            <span className="text-[12px] font-medium text-[#6B7A90] dark:text-slate-400">
              Jumlah Transaksi
            </span>
          </div>
        </>
      )}
    </div>
  );
}