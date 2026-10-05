"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ItemAbcAnalysis } from "@/types/item-abc-analysis";

interface ItemAbcParetoProps {
  items: ItemAbcAnalysis[];
}

/* =========================================================
   FORMAT CURRENCY
========================================================= */

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

/* =========================================================
   TOOLTIP
========================================================= */

function ParetoTooltip({
  active,
  payload,
}: any) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload as ItemAbcAnalysis;

  if (!item) {
    return null;
  }

  return (
    <div
      className="max-w-sm rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
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
            Rank
          </span>

          <span className="font-medium text-slate-900">
            {item.rank}
          </span>
        </div>

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
            % Spend
          </span>

          <span className="font-medium text-slate-900">
            {item.spend_percentage.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between gap-6">
          <span className="text-slate-500">
            Cumulative
          </span>

          <span className="font-medium text-slate-900">
            {item.cumulative_percentage.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between gap-6">
          <span className="text-slate-500">
            Class
          </span>

          <span
            className={`font-semibold ${
              item.abc_class === "A"
                ? "text-red-500"
                : item.abc_class === "B"
                  ? "text-amber-500"
                  : "text-emerald-500"
            }`}
          >
            {item.abc_class}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CLASS END RANK
========================================================= */

function getClassEndRank(
  items: ItemAbcAnalysis[],
  abcClass: "A" | "B" | "C"
) {
  let endRank: number | null = null;

  for (const item of items) {
    if (item.abc_class === abcClass) {
      endRank = item.rank;
    }
  }

  return endRank;
}

/* =========================================================
   ABC BOUNDARY BADGE
========================================================= */

function BoundaryBadge({
  viewBox,
  value,
  color,
}: {
  viewBox?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  value: string;
  color: string;
}) {
  if (!viewBox) {
    return null;
  }

  const x =
    Number(viewBox.x ?? 0) +
    Number(viewBox.width ?? 0) / 2;

  const y = Number(viewBox.y ?? 0) - 8;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      pointerEvents="none"
    >
      <rect
        x="-20"
        y="-12"
        width="40"
        height="24"
        rx="6"
        fill={color}
      />

      <text
        x="0"
        y="5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="11"
        fontWeight="700"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
      >
        {value}
      </text>
    </g>
  );
}

/* =========================================================
   CLASS ZONE LABEL
========================================================= */

function ClassZoneLabel({
  viewBox,
  title,
  range,
  itemCount,
  color,
}: {
  viewBox?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  title: string;
  range: string;
  itemCount: number;
  color: string;
}) {
  if (!viewBox) {
    return null;
  }

  const x =
    Number(viewBox.x ?? 0) +
    Number(viewBox.width ?? 0) / 2;

  const y = Number(viewBox.y ?? 0) + 30;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      pointerEvents="none"
    >
      <text
        x="0"
        y="0"
        textAnchor="middle"
        fill="#172B4D"
        fontSize="13"
        fontWeight="700"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
      >
        {title}
      </text>

      <text
        x="0"
        y="17"
        textAnchor="middle"
        fill="#334155"
        fontSize="11"
        fontWeight="500"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
      >
        {range}
      </text>

      <text
        x="0"
        y="34"
        textAnchor="middle"
        fill={color}
        fontSize="11"
        fontWeight="700"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
      >
        {itemCount.toLocaleString("id-ID")} items
      </text>
    </g>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function ItemAbcPareto({
  items,
}: ItemAbcParetoProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            ABC Pareto Chart
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Total spend per item with cumulative percentage and ABC classification boundaries.
          </p>
        </div>

        <div className="flex h-[390px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No ABC data available for the selected filter.
          </p>
        </div>
      </div>
    );
  }

  const chartItems = items;

  const totalItems = chartItems.length;

  const classAItems = chartItems.filter(
    (item) => item.abc_class === "A"
  ).length;

  const classBItems = chartItems.filter(
    (item) => item.abc_class === "B"
  ).length;

  const classCItems = chartItems.filter(
    (item) => item.abc_class === "C"
  ).length;

  const classAEndRank = getClassEndRank(
    chartItems,
    "A"
  );

  const classBEndRank = getClassEndRank(
    chartItems,
    "B"
  );

  const classCEndRank = getClassEndRank(
    chartItems,
    "C"
  );

  const xTicks = [
    0,
    100,
    classAEndRank,
    classBEndRank,
    totalItems,
  ].filter(
    (value, index, array) =>
      value !== null &&
      value !== undefined &&
      array.indexOf(value) === index
  ) as number[];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <h2
          className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          ABC Pareto Chart
        </h2>

        <p
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Total spend per item with cumulative percentage and ABC classification boundaries.
        </p>
      </div>

      {/* =====================================================
          CHART
      ====================================================== */}

      <ResponsiveContainer
        width="100%"
        height={410}
      >
        <ComposedChart
          data={chartItems}
          margin={{
            top: 82,
            right: 30,
            left: 18,
            bottom: 32,
          }}
        >
          {/* =================================================
              CLASS BACKGROUNDS
          ================================================== */}

          {classAEndRank !== null && (
            <ReferenceArea
              x1={1}
              x2={classAEndRank}
              yAxisId="spend"
              fill="#F87171"
              fillOpacity={0.075}
            />
          )}

          {classAEndRank !== null &&
            classBEndRank !== null && (
              <ReferenceArea
                x1={classAEndRank}
                x2={classBEndRank}
                yAxisId="spend"
                fill="#FBBF24"
                fillOpacity={0.075}
              />
            )}

          {classBEndRank !== null &&
            classCEndRank !== null && (
              <ReferenceArea
                x1={classBEndRank}
                x2={classCEndRank}
                yAxisId="spend"
                fill="#34D399"
                fillOpacity={0.075}
              />
            )}

          <CartesianGrid
            stroke="#E2E8F0"
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.7}
          />

          {/* =================================================
              X AXIS
          ================================================== */}

          <XAxis
            dataKey="rank"
            type="number"
            domain={[0, totalItems]}
            ticks={xTicks}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            height={42}
            tick={{
              fontSize: 12,
              fill: "#475569",
              fontWeight: 500,
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
            tickFormatter={(value) => {
              const rank = Number(value);

              if (rank === 0) {
                return "0";
              }

              if (rank === classAEndRank) {
                return `Rank ${rank.toLocaleString("id-ID")}`;
              }

              if (rank === classBEndRank) {
                return `Rank ${rank.toLocaleString("id-ID")}`;
              }

              return rank.toLocaleString("id-ID");
            }}
            label={{
              value: "Item Rank",
              position: "insideBottom",
              offset: -13,
              fill: "#64748B",
              fontSize: 12,
              fontWeight: 500,
            }}
          />

          {/* =================================================
              LEFT Y AXIS
          ================================================== */}

          <YAxis
            yAxisId="spend"
            orientation="left"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCompactCurrency}
            width={76}
            tick={{
              fontSize: 12,
              fill: "#475569",
              fontWeight: 600,
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          />

          {/* =================================================
              RIGHT Y AXIS
          ================================================== */}

          <YAxis
            yAxisId="percentage"
            orientation="right"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(value) => `${value}%`}
            tick={{
              fontSize: 12,
              fill: "#475569",
              fontWeight: 600,
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          />

          {/* =================================================
              TOOLTIP
          ================================================== */}

          <Tooltip
            cursor={{
              fill: "#F8FAFC",
            }}
            content={<ParetoTooltip />}
          />

          {/* =================================================
              TOP LEGEND
              
              Total Spend + Cumulative %
          ================================================== */}

          <Legend
            verticalAlign="top"
            align="right"
            height={30}
            wrapperStyle={{
              top: -8,
              right: 0,
              fontSize: 13,
              fontWeight: 500,
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          />

          {/* =================================================
              80% BOUNDARY
          ================================================== */}

          {classAEndRank !== null && (
            <ReferenceLine
              x={classAEndRank}
              yAxisId="spend"
              stroke="#F87171"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={(props: any) => (
                <BoundaryBadge
                  viewBox={props?.viewBox}
                  value="80%"
                  color="#F87171"
                />
              )}
            />
          )}

          {/* =================================================
              95% BOUNDARY
          ================================================== */}

          {classBEndRank !== null && (
            <ReferenceLine
              x={classBEndRank}
              yAxisId="spend"
              stroke="#FBBF24"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={(props: any) => (
                <BoundaryBadge
                  viewBox={props?.viewBox}
                  value="95%"
                  color="#FBBF24"
                />
              )}
            />
          )}

          {/* =================================================
              CLASS A LABEL
          ================================================== */}

          {classAEndRank !== null && (
            <ReferenceArea
              x1={1}
              x2={classAEndRank}
              y1={0}
              y2={100}
              yAxisId="percentage"
              fill="transparent"
              stroke="none"
              label={(props: any) => (
                <ClassZoneLabel
                  viewBox={props?.viewBox}
                  title="Class A"
                  range="0% – 80%"
                  itemCount={classAItems}
                  color="#EF4444"
                />
              )}
            />
          )}

          {/* =================================================
              CLASS B LABEL
          ================================================== */}

          {classAEndRank !== null &&
            classBEndRank !== null && (
              <ReferenceArea
                x1={classAEndRank}
                x2={classBEndRank}
                y1={0}
                y2={100}
                yAxisId="percentage"
                fill="transparent"
                stroke="none"
                label={(props: any) => (
                  <ClassZoneLabel
                    viewBox={props?.viewBox}
                    title="Class B"
                    range=">80% – 95%"
                    itemCount={classBItems}
                    color="#D97706"
                  />
                )}
              />
            )}

          {/* =================================================
              CLASS C LABEL
          ================================================== */}

          {classBEndRank !== null &&
            classCEndRank !== null && (
              <ReferenceArea
                x1={classBEndRank}
                x2={classCEndRank}
                y1={0}
                y2={100}
                yAxisId="percentage"
                fill="transparent"
                stroke="none"
                label={(props: any) => (
                  <ClassZoneLabel
                    viewBox={props?.viewBox}
                    title="Class C"
                    range=">95% – 100%"
                    itemCount={classCItems}
                    color="#059669"
                  />
                )}
              />
            )}

          {/* =================================================
              TOTAL SPEND BAR
          ================================================== */}

          <Bar
            yAxisId="spend"
            dataKey="total_spend"
            name="Total Spend"
            fill="#34C6A3"
            radius={[2, 2, 0, 0]}
            maxBarSize={16}
          />

          {/* =================================================
              CUMULATIVE LINE
          ================================================== */}

          <Line
            yAxisId="percentage"
            type="monotone"
            dataKey="cumulative_percentage"
            name="Cumulative %"
            stroke="#8B5CF6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}