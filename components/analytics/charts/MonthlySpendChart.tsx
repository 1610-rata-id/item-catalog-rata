"use client";

import { MonthlySpend } from "@/types/monthly-spend";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlySpendChartProps {
  monthlySpend: MonthlySpend[];
}

type MonthlyPoint = MonthlySpend & {
  total_purchase_orders?: number;
  total_purchase_requests?: number;
};

const numberFormatter = new Intl.NumberFormat("id-ID");

function formatCurrency(value: number) {
  return `Rp ${numberFormatter.format(value)}`;
}

function formatAxis(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(0)}M`;
  }

  return numberFormatter.format(value);
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: MonthlyPoint;
  }>;
}

function MonthlyTooltip({
  active,
  payload,
}: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  const po = data.total_purchase_orders;
  const pr = data.total_purchase_requests;

  return (
    <div className="min-w-[280px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-3 border-b border-slate-100 pb-3 text-base font-bold text-slate-900 dark:border-slate-700 dark:text-white">
        {data.month_name} {data.year}
      </h3>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Spend
          </p>

          <p className="mt-1 text-lg font-bold text-[#1D63B3] dark:text-blue-400">
            {formatCurrency(Number(data.total_spend ?? 0))}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="flex justify-between gap-6 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Total PO
            </span>

            <span className="font-bold text-slate-900 dark:text-white">
              {po == null ? "—" : numberFormatter.format(po)}
            </span>
          </div>

          <div className="mt-2 flex justify-between gap-6 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Total PR
            </span>

            <span className="font-bold text-slate-900 dark:text-white">
              {pr == null ? "—" : numberFormatter.format(pr)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MonthlySpendChart({
  monthlySpend,
}: MonthlySpendChartProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={monthlySpend}
          margin={{
            top: 15,
            right: 20,
            left: 5,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient
              id="monthlySpendGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#2563EB"
                stopOpacity={0.3}
              />

              <stop
                offset="95%"
                stopColor="#2563EB"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#E2E8F0"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month_name"
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 13,
              fontWeight: 700,
              fill: "#475569",
            }}
            tickMargin={12}
          />

          <YAxis
            tickFormatter={formatAxis}
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 12,
              fontWeight: 600,
              fill: "#475569",
            }}
            width={85}
          />

          <Tooltip
            content={<MonthlyTooltip />}
            cursor={{
              stroke: "#94A3B8",
              strokeDasharray: "4 4",
            }}
          />

          <Area
            type="monotone"
            dataKey="total_spend"
            stroke="#2563EB"
            strokeWidth={3}
            fill="url(#monthlySpendGradient)"
            dot={false}
            activeDot={{
              r: 6,
              fill: "#2563EB",
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}