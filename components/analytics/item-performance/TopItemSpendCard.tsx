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

import { ItemTopSpend } from "@/types/item-performance";

interface TopItemSpendCardProps {
  items: ItemTopSpend[];
}

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(0)} Jt`;
  }

  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} Rb`;
  }

  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}

function formatFullCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function truncateLabel(
  value: string,
  maxLength = 30
) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

function TopItemSpendTooltip({
  active,
  payload,
}: any) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload as ItemTopSpend;

  return (
    <div
      className="max-w-sm rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <p className="mb-3 break-words text-sm font-semibold text-slate-900">
        {item.item_name}
      </p>

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-6">
          <span className="text-slate-500">
            Total Spend
          </span>

          <span className="font-medium text-slate-900">
            {formatFullCurrency(item.total_spend)}
          </span>
        </div>

        <div className="flex justify-between gap-6">
          <span className="text-slate-500">
            Quantity
          </span>

          <span className="font-medium text-slate-900">
            {formatNumber(item.total_qty)}
          </span>
        </div>

        <div className="flex justify-between gap-6">
          <span className="text-slate-500">
            Purchase Orders
          </span>

          <span className="font-medium text-slate-900">
            {formatNumber(item.total_purchase_orders)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TopItemSpendCard({
  items,
}: TopItemSpendCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2
          className="text-lg font-semibold tracking-tight text-slate-900"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Top Items by Spend
        </h2>

        <p
          className="mt-1 text-sm text-slate-500"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Items with the highest procurement spending.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex h-[360px] items-center justify-center">
          <p className="text-sm text-slate-500">
            No item data available for the selected filter.
          </p>
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={360}
        >
          <BarChart
            data={items}
            layout="vertical"
            margin={{
              top: 4,
              right: 24,
              left: 12,
              bottom: 4,
            }}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="3 3"
              horizontal={false}
              opacity={0.7}
            />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompactCurrency}
              tick={{
                fontSize: 11,
                fill: "#64748B",
                fontFamily:
                  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            />

            <YAxis
              type="category"
              dataKey="item_name"
              width={190}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                truncateLabel(value)
              }
              tick={{
                fontSize: 11,
                fill: "#475569",
                fontFamily:
                  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            />

            <Tooltip
              cursor={{
                fill: "#F8FAFC",
              }}
              content={<TopItemSpendTooltip />}
            />

            <Bar
              dataKey="total_spend"
              fill="#2563EB"
              radius={[0, 6, 6, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}