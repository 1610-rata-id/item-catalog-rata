"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  ItemPriceHistory as ItemPriceHistoryData,
} from "@/types/item-price-analysis";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriceHistoryProps {
  data: ItemPriceHistoryData[];
}

type SortOption =
  | "date-desc"
  | "date-asc"
  | "unit-price-desc"
  | "unit-price-asc"
  | "total-price-desc"
  | "total-price-asc";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDateValue(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
}

export default function PriceHistory({
  data,
}: PriceHistoryProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] =
    useState<SortOption>("date-desc");

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = data.filter((row) => {
      if (!keyword) {
        return true;
      }

      return [
        row.item_name,
        row.vendor_name,
        row.po_number,
        row.uom,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword)
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return (
            getDateValue(a.order_date) -
            getDateValue(b.order_date)
          );

        case "unit-price-desc":
          return (
            Number(b.unit_price) -
            Number(a.unit_price)
          );

        case "unit-price-asc":
          return (
            Number(a.unit_price) -
            Number(b.unit_price)
          );

        case "total-price-desc":
          return (
            Number(b.total_price) -
            Number(a.total_price)
          );

        case "total-price-asc":
          return (
            Number(a.total_price) -
            Number(b.total_price)
          );

        case "date-desc":
        default:
          return (
            getDateValue(b.order_date) -
            getDateValue(a.order_date)
          );
      }
    });
  }, [data, search, sort]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Price History
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Recent item purchase price history.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[240px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No price history available for the selected
            period.
          </p>
        </div>
      ) : (
        <>
          {/* FILTER ROW */}
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* SEARCH */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search item, vendor, PO, or UOM..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* SORT */}
            <Select
              value={sort}
              onValueChange={(value) =>
                setSort(value as SortOption)
              }
            >
              <SelectTrigger className="h-10 w-full rounded-xl md:w-[230px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="date-desc">
                  Date: Newest → Oldest
                </SelectItem>

                <SelectItem value="date-asc">
                  Date: Oldest → Newest
                </SelectItem>

                <SelectItem value="unit-price-desc">
                  Unit Price: Highest → Lowest
                </SelectItem>

                <SelectItem value="unit-price-asc">
                  Unit Price: Lowest → Highest
                </SelectItem>

                <SelectItem value="total-price-desc">
                  Total Price: Highest → Lowest
                </SelectItem>

                <SelectItem value="total-price-asc">
                  Total Price: Lowest → Highest
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RESULT COUNT */}
          <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {filteredData.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {data.length}
            </span>{" "}
            records
          </div>

          {/* TABLE */}
          {filteredData.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No matching records found.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="max-h-[570px] overflow-y-auto overflow-x-auto">
                <table className="w-full min-w-[1150px] border-collapse text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#1D63B3]">
                      <th className="h-[50px] px-5 text-left text-xs font-semibold text-white">
                        Date
                      </th>

                      <th className="h-[50px] px-5 text-left text-xs font-semibold text-white">
                        Item
                      </th>

                      <th className="h-[50px] px-5 text-left text-xs font-semibold text-white">
                        Vendor
                      </th>

                      <th className="h-[50px] px-5 text-left text-xs font-semibold text-white">
                        PO
                      </th>

                      <th className="h-[50px] px-5 text-left text-xs font-semibold text-white">
                        UOM
                      </th>

                      <th className="h-[50px] px-5 text-right text-xs font-semibold text-white">
                        Unit Price
                      </th>

                      <th className="h-[50px] px-5 text-right text-xs font-semibold text-white">
                        Qty
                      </th>

                      <th className="h-[50px] px-5 text-right text-xs font-semibold text-white">
                        Total Price
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr
                        key={`${row.order_date}-${row.item_name}-${row.vendor_name}-${index}`}
                        className="h-[52px] border-b border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/60"
                      >
                        <td className="whitespace-nowrap px-5 text-slate-600 dark:text-slate-300">
                          {formatDate(row.order_date)}
                        </td>

                        <td className="max-w-[260px] px-5">
                          <div
                            className="truncate font-medium text-slate-900 dark:text-white"
                            title={row.item_name}
                          >
                            {row.item_name || "-"}
                          </div>
                        </td>

                        <td className="max-w-[240px] px-5">
                          <div
                            className="truncate text-slate-600 dark:text-slate-300"
                            title={row.vendor_name}
                          >
                            {row.vendor_name || "-"}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 text-slate-600 dark:text-slate-300">
                          {row.po_number || "-"}
                        </td>

                        <td className="whitespace-nowrap px-5 text-slate-600 dark:text-slate-300">
                          {row.uom || "-"}
                        </td>

                        <td className="whitespace-nowrap px-5 text-right font-medium text-slate-900 dark:text-white">
                          {formatCurrency(row.unit_price)}
                        </td>

                        <td className="whitespace-nowrap px-5 text-right text-slate-600 dark:text-slate-300">
                          {formatNumber(row.qty)}
                        </td>

                        <td className="whitespace-nowrap px-5 text-right font-medium text-slate-900 dark:text-white">
                          {formatCurrency(row.total_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}