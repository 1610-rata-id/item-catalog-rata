"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ItemTransactionHistory as ItemTransactionHistoryType,
} from "@/types/item-performance";

interface ItemTransactionHistoryProps {
  items: ItemTransactionHistoryType[];
}

type DateOrder = "DESC" | "ASC";

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ItemTransactionHistory({
  items,
}: ItemTransactionHistoryProps) {
  const [search, setSearch] = useState("");
  const [dateOrder, setDateOrder] =
    useState<DateOrder>("DESC");

  const filteredItems = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const result = items.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      const matchesItem = item.item_name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesVendor = item.vendor_name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesPr = (item.pr_number || "")
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesPo = (item.po_number || "")
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesUom = (item.uom || "")
        .toLowerCase()
        .includes(normalizedSearch);

      return (
        matchesItem ||
        matchesVendor ||
        matchesPr ||
        matchesPo ||
        matchesUom
      );
    });

    return [...result].sort((a, b) => {
      const dateA = new Date(
        a.order_date
      ).getTime();

      const dateB = new Date(
        b.order_date
      ).getTime();

      if (Number.isNaN(dateA)) return 1;
      if (Number.isNaN(dateB)) return -1;

      if (dateOrder === "DESC") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });
  }, [items, search, dateOrder]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Transaction History
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Recent procurement transactions based on the selected filter.
        </p>
      </div>

      {/* SEARCH + SORT */}
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
            placeholder="Search item, vendor, PR, PO, or UOM..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800"
          />
        </div>

        {/* SORT */}
        <Select
          value={dateOrder}
          onValueChange={(value) =>
            setDateOrder(value as DateOrder)
          }
        >
          <SelectTrigger className="h-10 w-full rounded-xl md:w-[220px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="rounded-xl">
            <SelectItem value="DESC">
              Date: Newest → Oldest
            </SelectItem>

            <SelectItem value="ASC">
              Date: Oldest → Newest
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}
      {filteredItems.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No transaction data found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="max-h-[570px] overflow-y-auto overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#1D63B3]">
                  <th className="h-[50px] whitespace-nowrap px-4 text-left text-xs font-semibold text-white">
                    Date
                  </th>

                  <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                    Item
                  </th>

                  <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                    Vendor
                  </th>

                  <th className="h-[50px] whitespace-nowrap px-4 text-left text-xs font-semibold text-white">
                    PR
                  </th>

                  <th className="h-[50px] whitespace-nowrap px-4 text-left text-xs font-semibold text-white">
                    PO
                  </th>

                  <th className="h-[50px] px-4 text-right text-xs font-semibold text-white">
                    Qty
                  </th>

                  <th className="h-[50px] px-4 text-left text-xs font-semibold text-white">
                    UOM
                  </th>

                  <th className="h-[50px] whitespace-nowrap px-4 text-right text-xs font-semibold text-white">
                    Unit Price
                  </th>

                  <th className="h-[50px] whitespace-nowrap px-4 text-right text-xs font-semibold text-white">
                    Total Price
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item, index) => (
                  <tr
                    key={`${item.po_number ?? "po"}-${item.item_name}-${index}`}
                    className="h-[52px] border-b border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900/60"
                  >
                    <td className="whitespace-nowrap px-4 text-slate-600 dark:text-slate-300">
                      {formatDate(item.order_date)}
                    </td>

                    <td className="max-w-[260px] px-4">
                      <div
                        className="truncate font-medium text-slate-900 dark:text-white"
                        title={item.item_name}
                      >
                        {item.item_name}
                      </div>
                    </td>

                    <td className="max-w-[220px] px-4">
                      <div
                        className="truncate text-slate-600 dark:text-slate-300"
                        title={item.vendor_name}
                      >
                        {item.vendor_name}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 text-slate-600 dark:text-slate-300">
                      {item.pr_number || "-"}
                    </td>

                    <td className="whitespace-nowrap px-4 font-medium text-slate-700 dark:text-slate-200">
                      {item.po_number || "-"}
                    </td>

                    <td className="px-4 text-right font-medium text-slate-700 dark:text-slate-200">
                      {formatNumber(item.qty)}
                    </td>

                    <td className="px-4 text-slate-600 dark:text-slate-300">
                      {item.uom || "-"}
                    </td>

                    <td className="whitespace-nowrap px-4 text-right text-slate-600 dark:text-slate-300">
                      {formatCurrency(item.unit_price)}
                    </td>

                    <td className="whitespace-nowrap px-4 text-right font-medium text-slate-900 dark:text-white">
                      {formatCurrency(item.total_price)}
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
          {items.length} transactions
        </span>
      </div>
    </div>
  );
}