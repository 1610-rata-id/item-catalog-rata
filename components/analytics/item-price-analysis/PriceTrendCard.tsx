"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ItemPriceTrend } from "@/types/item-price-analysis";

interface PriceTrendCardProps {
  data: ItemPriceTrend[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonth(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
  }).format(date);
}

function formatAxisCurrency(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} jt`;
  }

  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} rb`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function PriceTrendCard({
  data,
}: PriceTrendCardProps) {
  const chartData = data.map((item) => ({
    ...item,
    month_label: formatMonth(item.month_start),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Price Trend
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Rata-rata harga pembelian per bulan.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tidak ada data harga untuk periode yang dipilih.
          </p>
        </div>
      ) : (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#E2E8F0"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month_label"
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tickFormatter={formatAxisCurrency}
                tick={{
                  fill: "#64748B",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                width={85}
              />

              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Average Price",
                ]}
                labelFormatter={(label) => `Bulan: ${label}`}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  boxShadow:
                    "0 4px 12px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Line
                type="monotone"
                dataKey="average_price"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#2563EB",
                  strokeWidth: 2,
                  stroke: "#FFFFFF",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}