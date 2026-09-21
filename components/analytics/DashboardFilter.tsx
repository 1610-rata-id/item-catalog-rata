"use client";

import { useEffect, useMemo, useState } from "react";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelect from "@/components/ui/multi-select";

import { useDashboardFilter } from "@/hooks/use-dashboard-filter";
import { VendorList } from "@/types/vendor-list";

interface DashboardFilterProps {
  vendors: VendorList[];
}

interface ItemOptionResponse {
  success: boolean;
  data: {
    item_name: string;
  }[];
  error?: string;
}

export default function DashboardFilter({
  vendors,
}: DashboardFilterProps) {
  const {
    selectedYear,
    selectedMonths,
    selectedVendors,
    selectedItems,

    handleYearChange,
    handleMonthChange,
    handleVendorChange,
    handleItemChange,
    handleReset,
  } = useDashboardFilter();

  // ============================================================
  // ITEM SEARCH STATE
  // ============================================================

  const [itemSearch, setItemSearch] = useState("");

  const [itemOptions, setItemOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [itemLoading, setItemLoading] = useState(false);


  // ============================================================
  // MONTH OPTIONS
  // ============================================================

  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];


  // ============================================================
  // VENDOR OPTIONS
  // ============================================================

  const vendorOptions = useMemo(
    () =>
      vendors.map((vendor) => ({
        value: vendor.vendor_name,
        label: vendor.vendor_name,
      })),
    [vendors]
  );


  // ============================================================
  // LOAD ITEMS FROM API
  // ============================================================

  useEffect(() => {
    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setItemLoading(true);

        const params = new URLSearchParams();

        params.set(
          "year",
          String(selectedYear)
        );

        params.set(
          "limit",
          "100"
        );

        if (itemSearch.trim()) {
          params.set(
            "search",
            itemSearch.trim()
          );
        }

        const response = await fetch(
          `/api/analytics/items?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load items: ${response.status}`
          );
        }

        const result =
          (await response.json()) as ItemOptionResponse;

        if (!result.success) {
          throw new Error(
            result.error ||
              "Failed to load item options"
          );
        }

        const options =
          (result.data ?? []).map((item) => ({
            value: item.item_name,
            label: item.item_name,
          }));

        setItemOptions(options);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Failed to load item filter options:",
          error
        );

        setItemOptions([]);
      } finally {
        if (!controller.signal.aborted) {
          setItemLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [selectedYear, itemSearch]);


  // ============================================================
  // KEEP SELECTED ITEMS VISIBLE
  // ============================================================

  const mergedItemOptions = useMemo(() => {
    const map = new Map<
      string,
      { value: string; label: string }
    >();

    for (const option of itemOptions) {
      map.set(option.value, option);
    }

    for (const item of selectedItems) {
      if (!map.has(item)) {
        map.set(item, {
          value: item,
          label: item,
        });
      }
    }

    return Array.from(map.values());
  }, [itemOptions, selectedItems]);


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Card className="mb-8 rounded-2xl border-0 bg-white p-6 shadow-sm dark:bg-neutral-900">

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_220px_320px_400px_170px]">

        {/* =====================================================
            YEAR
        ===================================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
            Year
          </label>

          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="2026">
                2026
              </SelectItem>

              <SelectItem value="2025">
                2025
              </SelectItem>

              <SelectItem value="2024">
                2024
              </SelectItem>
            </SelectContent>
          </Select>
        </div>


        {/* =====================================================
            MONTH
        ===================================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
            Month
          </label>

          <MultiSelect
            className="w-full"
            placeholder="All Months"
            searchPlaceholder="Search month..."
            emptyMessage="No month found."
            options={monthOptions}
            value={selectedMonths}
            onApply={handleMonthChange}
          />
        </div>


        {/* =====================================================
            VENDOR
        ===================================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
            Vendor
          </label>

          <MultiSelect
            className="w-full"
            placeholder="All Vendors"
            searchPlaceholder="Search vendor..."
            emptyMessage="No vendor found."
            options={vendorOptions}
            value={selectedVendors}
            onApply={handleVendorChange}
          />
        </div>


        {/* =====================================================
            ITEM
        ===================================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
            Item
          </label>

          <MultiSelect
            className="w-full"
            placeholder={
              itemLoading
                ? "Loading items..."
                : "All Items"
            }
            searchPlaceholder="Search item..."
            emptyMessage="No item found."
            options={mergedItemOptions}
            value={selectedItems}
            onApply={handleItemChange}
            searchValue={itemSearch}
            onSearchChange={setItemSearch}
            serverSearch
          />
        </div>


        {/* =====================================================
            RESET
        ===================================================== */}

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-11 w-full rounded-xl"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        </div>

      </div>

    </Card>
  );
}