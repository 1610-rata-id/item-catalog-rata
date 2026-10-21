
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ItemPriceDistribution } from "@/types/item-price-analysis";

interface PriceDistributionCardProps {
  data: ItemPriceDistribution[];
  enableClickSelection: boolean;
}

interface ChartDatum extends ItemPriceDistribution {
  pointKey: string;
  monthLabel: string;
  percentage: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatAxisCurrency(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} M`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} jt`;
  }

  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} rb`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatMonth(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

export default function PriceDistributionCard({
  data,
  enableClickSelection,
}: PriceDistributionCardProps) {
  const [selectedPoint, setSelectedPoint] = useState<ChartDatum | null>(null);

  const chartData = useMemo<ChartDatum[]>(() => {
    const totalsByMonth = new Map<string, number>();

    for (const item of data) {
      totalsByMonth.set(
        item.month_start,
        (totalsByMonth.get(item.month_start) ?? 0) +
          item.transaction_count
      );
    }

    return data.map((item) => ({
      ...item,
      pointKey: `${item.month_start}-${item.unit_price}`,
      monthLabel: formatMonth(item.month_start),
      percentage:
        (item.transaction_count /
          (totalsByMonth.get(item.month_start) || 1)) *
        100,
    }));
  }, [data]);

  useEffect(() => {
    setSelectedPoint(null);
  }, [data, enableClickSelection]);

  const selectedKey = selectedPoint?.pointKey;

  const totalTransactions = data.reduce(
    (total, item) => total + item.transaction_count,
    0
  );

  const handleBarClick = (entry: unknown) => {
    if (!enableClickSelection) return;

    const clicked = entry as {
      payload?: ChartDatum;
      pointKey?: string;
    };

    const point =
      clicked.payload ??
      chartData.find((item) => item.pointKey === clicked.pointKey);

    if (!point) return;

    setSelectedPoint((current) =>
      current?.pointKey === point.pointKey ? null : point
    );
  };

  const renderTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: ReadonlyArray<{ payload?: ChartDatum }>;
  }) => {
    if (!active || !payload?.length) return null;

    const point = payload[0]?.payload;

    if (!point) return null;

    return (
      <div className="min-w-[210px] rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {point.monthLabel}
        </p>

        <p className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
          {formatCurrency(point.unit_price)}
        </p>

        <div className="flex items-center justify-between gap-5 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Transaction Count
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatNumber(point.transaction_count)}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-5 border-t border-slate-100 pt-2 text-xs dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400">
            Percentage in Month
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {point.percentage.toLocaleString("id-ID", {
              maximumFractionDigits: 1,
            })}
            %
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Price Distribution
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Actual transaction prices after PPN by month.
        </p>

        {enableClickSelection && (
          <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
            Klik batang untuk melihat detail harga. Klik batang yang sama
            lagi untuk menutup detail.
          </p>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No price data available for the selected period.
          </p>
        </div>
      ) : (
        <>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 16, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="pointKey"
                  tickFormatter={(value: string) =>
                    chartData.find((item) => item.pointKey === value)
                      ?.monthLabel ?? ""
                  }
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  interval="preserveStartEnd"
                  minTickGap={18}
                />

                <YAxis
                  type="number"
                  domain={[0, "auto"]}
                  tickFormatter={formatAxisCurrency}
                  tick={{ fill: "#64748B", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={76}
                />

                <Tooltip
                  content={renderTooltip}
                  cursor={{ fill: "#DBEAFE", fillOpacity: 0.35 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                />

                <Bar
                  dataKey="unit_price"
                  name="Harga setelah PPN"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={34}
                  onClick={handleBarClick}
                  cursor={enableClickSelection ? "pointer" : "default"}
                >
                  {chartData.map((item) => (
                    <Cell
                      key={item.pointKey}
                      fill={
                        selectedKey === item.pointKey
                          ? "#1D63B3"
                          : "#60A5FA"
                      }
                      stroke={
                        selectedKey === item.pointKey
                          ? "#1D63B3"
                          : "none"
                      }
                      strokeWidth={selectedKey === item.pointKey ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {selectedPoint && enableClickSelection && (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                    Harga dipilih
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {selectedPoint.monthLabel}
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedPoint.unit_price)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPoint(null)}
                  className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
                >
                  Hapus pilihan
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-blue-200 pt-3 sm:grid-cols-2 dark:border-blue-900">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transaction Count
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {formatNumber(selectedPoint.transaction_count)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Percentage in Month
                  </p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {selectedPoint.percentage.toLocaleString("id-ID", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-[3px] bg-blue-500" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Harga setelah PPN
            </span>
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            {formatNumber(totalTransactions)} transactions ·{" "}
            {formatNumber(chartData.length)} monthly unique-price entries
          </p>
        </>
      )}
    </div>
  );
}
