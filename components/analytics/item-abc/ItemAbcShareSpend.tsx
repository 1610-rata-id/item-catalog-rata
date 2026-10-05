"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ItemAbcAnalysis } from "@/types/item-abc-analysis";

interface ItemAbcShareSpendProps {
  items: ItemAbcAnalysis[];
}

interface ClassSummary {
  className: "A" | "B" | "C";
  itemShare: number;
  spendShare: number;
}

function calculateSummary(
  items: ItemAbcAnalysis[]
): ClassSummary[] {
  const totalItems = items.length;

  const totalSpend = items.reduce(
    (sum, item) => sum + Number(item.total_spend || 0),
    0
  );

  const classes: Array<"A" | "B" | "C"> = [
    "A",
    "B",
    "C",
  ];

  return classes.map((className) => {
    const classItems = items.filter(
      (item) => item.abc_class === className
    );

    const classSpend = classItems.reduce(
      (sum, item) =>
        sum + Number(item.total_spend || 0),
      0
    );

    return {
      className,
      itemShare:
        totalItems === 0
          ? 0
          : (classItems.length / totalItems) * 100,
      spendShare:
        totalSpend === 0
          ? 0
          : (classSpend / totalSpend) * 100,
    };
  });
}

export default function ItemAbcShareSpend({
  items,
}: ItemAbcShareSpendProps) {
  const summary = calculateSummary(items);

  const chartData = summary.map((item) => ({
    className: `Class ${item.className}`,
    itemShare: Number(item.itemShare.toFixed(2)),
    spendShare: Number(item.spendShare.toFixed(2)),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Item Share vs Spend Contribution
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Comparison of item share and procurement spend contribution by class.
        </p>
      </div>

      <div className="mt-4 h-[340px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 55,
              left: 10,
              bottom: 5,
            }}
            barGap={8}
            barCategoryGap="22%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#E2E8F0"
            />

            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) =>
                `${value}%`
              }
              tick={{
                fontSize: 11,
                fill: "#64748B",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="className"
              width={65}
              tick={{
                fontSize: 12,
                fill: "#334155",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "rgba(148, 163, 184, 0.08)",
              }}
              formatter={(value, name) => [
                `${Number(value).toFixed(1)}%`,
                name === "itemShare"
                  ? "% of Items"
                  : "% of Total Spend",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow:
                  "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />

            <Bar
              dataKey="itemShare"
              name="itemShare"
              fill="#FB7185"
              radius={[0, 5, 5, 0]}
              barSize={22}
            >
              <LabelList
                dataKey="itemShare"
                position="right"
                formatter={(value) =>
                  `${Number(value).toFixed(1)}%`
                }
                fill="#475569"
                fontSize={11}
              />
            </Bar>

            <Bar
              dataKey="spendShare"
              name="spendShare"
              fill="#2563EB"
              radius={[0, 5, 5, 0]}
              barSize={22}
            >
              <LabelList
                dataKey="spendShare"
                position="right"
                formatter={(value) =>
                  `${Number(value).toFixed(1)}%`
                }
                fill="#475569"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 flex items-center justify-center gap-7 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span>% of Items</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          <span>% of Total Spend</span>
        </div>
      </div>
    </div>
  );
}