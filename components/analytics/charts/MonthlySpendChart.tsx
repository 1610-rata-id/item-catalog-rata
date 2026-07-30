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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MonthlySpendChartProps {
  monthlySpend: MonthlySpend[];
}

const formatCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(0)}M`;
  }

  return new Intl.NumberFormat("id-ID").format(value);
};

export default function MonthlySpendChart({
  monthlySpend,
}: MonthlySpendChartProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Monthly Spend
        </CardTitle>

        <CardDescription>
          Procurement spending throughout the selected period
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart
            data={monthlySpend}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="monthlySpend"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563EB"
                  stopOpacity={0.35}
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
                fontSize: 12,
                fill: "#64748B",
              }}
            />

            <YAxis
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
                fill: "#64748B",
              }}
            />

            <Tooltip
              formatter={(value: number) => [
                formatCurrency(value),
                "Total Spend",
              ]}
              cursor={{
                stroke: "#94A3B8",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,.12)",
                padding: "12px 16px",
              }}
            />

            <Area
              type="monotone"
              dataKey="total_spend"
              stroke="#2563EB"
              strokeWidth={3}
              fill="url(#monthlySpend)"
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                fill: "#2563EB",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}