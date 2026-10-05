"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ItemAbcDistributionProps {
  classA: number;
  classB: number;
  classC: number;
}

const CLASS_COLORS = {
  A: "#F87171",
  B: "#FBBF24",
  C: "#34D399",
};

function AbcTooltip({
  active,
  payload,
}: any) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <p className="text-sm font-medium text-slate-900">
        {item.name}
      </p>

      <p className="mt-1 text-sm text-slate-600">
        {new Intl.NumberFormat("id-ID").format(
          item.value
        )}{" "}
        items
      </p>
    </div>
  );
}

export default function ItemAbcDistribution({
  classA,
  classB,
  classC,
}: ItemAbcDistributionProps) {
  const data = [
    {
      name: "Class A",
      value: classA,
      className: "A",
    },
    {
      name: "Class B",
      value: classB,
      className: "B",
    },
    {
      name: "Class C",
      value: classC,
      className: "C",
    },
  ];

  const totalItems = classA + classB + classC;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* HEADER */}
      <div className="mb-3">
        <h2
          className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Item Distribution by Class
        </h2>

        <p
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Distribution of items across ABC classifications.
        </p>
      </div>

      {totalItems === 0 ? (
        <div className="flex h-[380px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No ABC data available for the selected filter.
          </p>
        </div>
      ) : (
        <div className="flex h-[380px] flex-col items-center justify-center">
          {/* DONUT */}
          <div className="relative h-[235px] w-[235px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={66}
                  outerRadius={103}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.className}
                      fill={
                        CLASS_COLORS[
                          entry.className as keyof typeof CLASS_COLORS
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={<AbcTooltip />}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER LABEL */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {new Intl.NumberFormat("id-ID").format(
                  totalItems
                )}
              </span>

              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Total Items
              </span>
            </div>
          </div>

          {/* LEGEND */}
          <div className="mt-2 grid w-full grid-cols-3 gap-3">
            {data.map((item) => {
              const percentage =
                totalItems > 0
                  ? (item.value / totalItems) * 100
                  : 0;

              return (
                <div
                  key={item.className}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          CLASS_COLORS[
                            item.className as keyof typeof CLASS_COLORS
                          ],
                      }}
                    />

                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item.name}
                    </p>
                  </div>

                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {percentage.toFixed(1)}%
                  </p>

                  <p className="mt-0.5 text-base font-semibold text-slate-900 dark:text-white">
                    {new Intl.NumberFormat("id-ID").format(
                      item.value
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}