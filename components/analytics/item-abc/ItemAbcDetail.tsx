"use client";

import {
  Check,
  ChevronDown,
  Search,
} from "lucide-react";
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

  const [classOpen, setClassOpen] =
    useState(false);

  const [rankOpen, setRankOpen] =
    useState(false);

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
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
    }

    if (abcClass === "B") {
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* HEADER */}

      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Item Classification Detail
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Detailed ABC classification based on procurement
          spending.
        </p>
      </div>

      {/* FILTER */}

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* SEARCH */}

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

        {/* DROPDOWNS */}

        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          {/* CLASS DROPDOWN */}

          <div className="relative w-full sm:w-[150px]">
            <button
              type="button"
              onClick={() => {
                setClassOpen((open) => !open);
                setRankOpen(false);
              }}
              className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
            >
              <span>
                {selectedClass === "ALL"
                  ? "All Classes"
                  : `Class ${selectedClass}`}
              </span>

              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  classOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {classOpen && (
              <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {[
                  {
                    value: "ALL",
                    label: "All Classes",
                  },
                  {
                    value: "A",
                    label: "Class A",
                  },
                  {
                    value: "B",
                    label: "Class B",
                  },
                  {
                    value: "C",
                    label: "Class C",
                  },
                ].map((option) => {
                  const selected =
                    selectedClass === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSelectedClass(
                          option.value as
                            | "ALL"
                            | "A"
                            | "B"
                            | "C"
                        );
                        setClassOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-blue-500/10"
                    >
                      <span>{option.label}</span>

                      {selected && (
                        <Check className="h-4 w-4 text-[#1D63B3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RANK DROPDOWN */}

          <div className="relative w-full sm:w-[190px]">
            <button
              type="button"
              onClick={() => {
                setRankOpen((open) => !open);
                setClassOpen(false);
              }}
              className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
            >
              <span className="truncate">
                {rankOrder === "ASC"
                  ? "Rank: Lowest → Highest"
                  : "Rank: Highest → Lowest"}
              </span>

              <ChevronDown
                className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                  rankOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {rankOpen && (
              <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {[
                  {
                    value: "DESC",
                    label: "Rank: Highest → Lowest",
                  },
                  {
                    value: "ASC",
                    label: "Rank: Lowest → Highest",
                  },
                ].map((option) => {
                  const selected =
                    rankOrder === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRankOrder(
                          option.value as RankOrder
                        );
                        setRankOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-blue-500/10"
                    >
                      <span>{option.label}</span>

                      {selected && (
                        <Check className="h-4 w-4 text-[#1D63B3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
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
          <div className="max-h-[570px] overflow-y-auto overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#1D63B3]">
                  <th className="h-[50px] w-16 px-4 text-left text-xs font-semibold text-white">
                    No
                  </th>

                  <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                    Item
                  </th>

                  <th className="h-[50px] whitespace-nowrap px-4 text-right text-xs font-semibold text-white">
                    Total Spend
                  </th>

                  <th className="h-[50px] whitespace-nowrap px-4 text-right text-xs font-semibold text-white">
                    % Spend
                  </th>

                  <th className="h-[50px] whitespace-nowrap px-4 text-right text-xs font-semibold text-white">
                    Cumulative %
                  </th>

                  <th className="h-[50px] w-28 px-4 text-center text-xs font-semibold text-white">
                    Class
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item, index) => (
                  <tr
                    key={`${item.rank}-${item.item_name}`}
                    className="h-[52px] border-b border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-4 text-slate-500 dark:text-slate-400">
                      {index + 1}
                    </td>

                    <td className="max-w-[420px] px-4">
                      <div
                        className="truncate font-medium text-slate-900 dark:text-white"
                        title={item.item_name}
                      >
                        {item.item_name}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 text-right font-medium text-slate-900 dark:text-white">
                      {formatCurrency(item.total_spend)}
                    </td>

                    <td className="whitespace-nowrap px-4 text-right text-slate-600 dark:text-slate-300">
                      {item.spend_percentage.toFixed(2)}%
                    </td>

                    <td className="whitespace-nowrap px-4 text-right text-slate-600 dark:text-slate-300">
                      {item.cumulative_percentage.toFixed(2)}%
                    </td>

                    <td className="px-4 text-center">
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

      {/* RESULT COUNT */}

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing {filteredItems.length} of{" "}
          {items.length} items
        </span>
      </div>
    </div>
  );
}