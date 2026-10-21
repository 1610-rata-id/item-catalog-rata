
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ItemPriceTrend } from "@/types/item-price-analysis";

interface PriceTrendCardProps {
  data: ItemPriceTrend[];
}

interface ChartDatum extends ItemPriceTrend {
  month_label: string;
}

interface CustomTooltipProps {
  payload?: ReadonlyArray<{
    payload?: ChartDatum;
  }>;
}

interface TooltipPosition {
  x: number;
  y: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonth(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
    month: "short",
  });
}

function formatFullMonth(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
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

function CustomTooltip({ payload }: CustomTooltipProps) {
  const item = payload?.[0]?.payload;

  if (!item) return null;

  return (
    <div className="min-w-[250px] rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Period
        </p>
        <p className="font-semibold text-slate-900 dark:text-white">
          {formatFullMonth(item.month_start)}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Average Price
        </p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(item.average_price)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 py-3 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Highest Price
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {formatCurrency(item.highest_price)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lowest Price
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {formatCurrency(item.lowest_price)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transaction Count
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
            {item.transaction_count.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            transactions
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total PO
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
            {item.total_po.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            purchase orders
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PriceTrendCard({ data }: PriceTrendCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [selectedPoint, setSelectedPoint] = useState<ChartDatum | null>(null);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);

  const chartData = useMemo<ChartDatum[]>(
    () =>
      data.map((item) => ({
        ...item,
        month_label: formatMonth(item.month_start),
      })),
    [data]
  );

  useEffect(() => {
    setSelectedPoint(null);
    setTooltipPosition(null);
  }, [data]);

  useEffect(() => {
    if (!selectedPoint || !tooltipPosition) return;

    const container = containerRef.current;
    const tooltip = tooltipRef.current;

    if (!container || !tooltip) return;

    const margin = 8;
    const maxX = Math.max(
      margin,
      container.clientWidth - tooltip.offsetWidth - margin
    );
    const maxY = Math.max(
      margin,
      container.clientHeight - tooltip.offsetHeight - margin
    );

    setTooltipPosition((current) => {
      if (!current) return current;

      const x = Math.min(Math.max(margin, current.x), maxX);
      const y = Math.min(Math.max(margin, current.y), maxY);

      if (x === current.x && y === current.y) return current;

      return { x, y };
    });
  }, [selectedPoint, tooltipPosition]);

  const handlePointClick = (
    point: ChartDatum,
    x: number,
    y: number
  ) => {
    if (selectedPoint?.month_start === point.month_start) {
      setSelectedPoint(null);
      setTooltipPosition(null);
      return;
    }

    setSelectedPoint(point);
    setTooltipPosition({ x, y });
  };

  const closeTooltip = () => {
    setSelectedPoint(null);
    setTooltipPosition(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Price Trend
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Average purchase price per month.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Klik titik pada grafik untuk mempertahankan tooltip. Klik titik yang
          sama lagi untuk menutupnya.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No price data available for the selected period.
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="relative h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                stroke="#E2E8F0"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month_label"
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tickFormatter={formatAxisCurrency}
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={85}
              />

              <Tooltip
                active={selectedPoint ? false : undefined}
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#94A3B8",
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="average_price"
                stroke="none"
                fill="#3B82F6"
                fillOpacity={0.15}
                activeDot={false}
                isAnimationActive={false}
                tooltipType="none"
              />

              <Line
                type="monotone"
                dataKey="average_price"
                stroke="#2563EB"
                strokeWidth={2.5}
                activeDot={false}
                isAnimationActive={false}
                dot={(props: {
                  cx?: number;
                  cy?: number;
                  payload?: ChartDatum;
                }) => {
                  const { cx, cy, payload } = props;

                  if (
                    cx === undefined ||
                    cy === undefined ||
                    !payload
                  ) {
                    return <g />;
                  }

                  const isSelected =
                    selectedPoint?.month_start === payload.month_start;

                  return (
                    <circle
                      key={payload.month_start}
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? "#1D4ED8" : "#2563EB"}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      style={{ cursor: "pointer", outline: "none" }}
                      onClick={(event) => {
                        event.stopPropagation();

                        const container = containerRef.current;
                        if (!container) return;

                        const containerRect =
                          container.getBoundingClientRect();

                        const pointRect =
                          event.currentTarget.getBoundingClientRect();

                        const pointX =
                          pointRect.left -
                          containerRect.left +
                          pointRect.width / 2;

                        const pointY =
                          pointRect.top -
                          containerRect.top +
                          pointRect.height / 2;

                        const tooltipWidth =
                          tooltipRef.current?.offsetWidth ?? 280;
                        const tooltipHeight =
                          tooltipRef.current?.offsetHeight ?? 300;

                        const gap = 12;
                        const padding = 8;

                        let x = pointX + gap;
                        let y = pointY - tooltipHeight / 2;

                        if (
                          x + tooltipWidth >
                          container.clientWidth - padding
                        ) {
                          x = pointX - tooltipWidth - gap;
                        }

                        if (x < padding) {
                          x = Math.max(
                            padding,
                            Math.min(
                              pointX - tooltipWidth / 2,
                              container.clientWidth -
                                tooltipWidth -
                                padding
                            )
                          );
                        }

                        y = Math.max(
                          padding,
                          Math.min(
                            y,
                            container.clientHeight -
                              tooltipHeight -
                              padding
                          )
                        );

                        handlePointClick(payload, x, y);
                      }}
                    />
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {selectedPoint && tooltipPosition && (
            <div
              ref={tooltipRef}
              className="absolute z-20 max-w-[calc(100%-16px)] rounded-xl"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
              }}
            >
              <CustomTooltip payload={[{ payload: selectedPoint }]} />

              
<button
  type="button"
  onClick={closeTooltip}
  className="mt-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:border-blue-700 hover:bg-blue-700"
>
  Close
</button>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
