"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ItemAbcAnalysis } from "@/types/item-abc-analysis";

interface ItemAbcDetailProps {
  items: ItemAbcAnalysis[];
}

type RankOrder = "DESC" | "ASC";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ItemAbcDetail({
  items,
}: ItemAbcDetailProps) {
  const [search, setSearch] = useState("");

  const [selectedClass, setSelectedClass] =
    useState<"ALL" | "A" | "B" | "C">("ALL");

  const [rankOrder, setRankOrder] =
    useState<RankOrder>("ASC");

  const filteredItems = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    const result = items.filter((item) => {
      const matchesSearch =
        normalizedSearch === "" ||
        item.item_name
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesClass =
        selectedClass === "ALL" ||
        item.abc_class === selectedClass;

      return matchesSearch && matchesClass;
    });

    return [...result].sort((a, b) => {
      if (rankOrder === "DESC") {
        return a.rank - b.rank;
      }

      return b.rank - a.rank;
    });
  }, [
    items,
    search,
    selectedClass,
    rankOrder,
  ]);

  function getClassBadge(
    abcClass: ItemAbcAnalysis["abc_class"]
  ) {
    if (abcClass === "A") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (abcClass === "B") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* HEADER */}
      <div className="mb-5">
        <h2
          className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Item Classification Detail
        </h2>

        <p
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
          style={{
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Detailed ABC classification based on procurement
          spending.
        </p>
      </div>

      {/* FILTER */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search item..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <select
            value={selectedClass}
            onChange={(event) =>
              setSelectedClass(
                event.target.value as
                  | "ALL"
                  | "A"
                  | "B"
                  | "C"
              )
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800 sm:w-[150px]"
          >
            <option value="ALL">All Classes</option>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
          </select>

          <select
            value={rankOrder}
            onChange={(event) =>
              setRankOrder(
                event.target.value as RankOrder
              )
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800 sm:w-[190px]"
          >
            <option value="DESC">
              Rank: Highest → Lowest
            </option>
            <option value="ASC">
              Rank: Lowest → Highest
            </option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      {filteredItems.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No item classification data available.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full min-w-[850px] border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="w-16 px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    No
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    Item
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                    Total Spend
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                    % Spend
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                    Cumulative %
                  </th>

                  <th className="w-28 px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Class
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item, index) => (
                  <tr
                    key={`${item.rank}-${item.item_name}`}
                    className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {index + 1}
                    </td>

                    <td className="max-w-[420px] px-4 py-3">
                      <div
                        className="truncate font-medium text-slate-900 dark:text-white"
                        title={item.item_name}
                      >
                        {item.item_name}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-900 dark:text-white">
                      {formatCurrency(item.total_spend)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                      {item.spend_percentage.toFixed(2)}%
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                      {item.cumulative_percentage.toFixed(2)}%
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex min-w-[42px] items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${getClassBadge(
                          item.abc_class
                        )}`}
                      >
                        {item.abc_class}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing {filteredItems.length} of{" "}
          {items.length} items
        </span>
      </div>
    </div>
  );
}