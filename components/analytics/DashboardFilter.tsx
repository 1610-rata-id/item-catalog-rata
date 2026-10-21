
"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface VendorOptionResponse {
  success: boolean;
  data: {
    vendor_name: string;
  }[];
  error?: string;
}

interface FilterOption {
  value: string;
  label: string;
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

  const [itemSearch, setItemSearch] = useState("");
  const [itemOptions, setItemOptions] = useState<FilterOption[]>([]);
  const [itemLoading, setItemLoading] = useState(false);

  const [vendorOptions, setVendorOptions] = useState<FilterOption[]>(
    []
  );
  const [vendorLoading, setVendorLoading] = useState(false);

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

  // Initial vendor options are used while the API is loading.
  const initialVendorOptions = useMemo(
    () =>
      vendors.map((vendor) => ({
        value: vendor.vendor_name,
        label: vendor.vendor_name,
      })),
    [vendors]
  );

  // Load item options.
  useEffect(() => {
    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setItemLoading(true);

        const params = new URLSearchParams();
        params.set("year", String(selectedYear));
        params.set("limit", "100");

        if (itemSearch.trim()) {
          params.set("search", itemSearch.trim());
        }

        const response = await fetch(
          `/api/analytics/items?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to load items: ${response.status}`);
        }

        const result =
          (await response.json()) as ItemOptionResponse;

        if (!result.success) {
          throw new Error(
            result.error || "Failed to load item options"
          );
        }

        setItemOptions(
          (result.data ?? []).map((item) => ({
            value: item.item_name,
            label: item.item_name,
          }))
        );
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Failed to load item filter options:", error);
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

  // Keep selected items visible even when they are outside the current
  // search results.
  const mergedItemOptions = useMemo(() => {
    const map = new Map<string, FilterOption>();

    for (const option of itemOptions) {
      map.set(option.value, option);
    }

    for (const item of selectedItems) {
      if (!map.has(item)) {
        map.set(item, { value: item, label: item });
      }
    }

    return Array.from(map.values());
  }, [itemOptions, selectedItems]);

  // Load vendor options based on the selected items and year.
  useEffect(() => {
    const controller = new AbortController();

    async function loadVendors() {
      setVendorLoading(true);
      setVendorOptions([]);

      try {
        const params = new URLSearchParams();
        params.set("year", String(selectedYear));
        params.set("limit", "500");

        if (selectedItems.length > 0) {
          params.set("items", selectedItems.join(","));
        }

        const response = await fetch(
          `/api/analytics/vendors?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load vendor options: ${response.status}`
          );
        }

        const result =
          (await response.json()) as VendorOptionResponse;

        if (!result.success) {
          throw new Error(
            result.error || "Failed to load vendor options"
          );
        }

        setVendorOptions(
          (result.data ?? []).map((vendor) => ({
            value: vendor.vendor_name,
            label: vendor.vendor_name,
          }))
        );
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Failed to load vendor filter options:", error);
        setVendorOptions([]);
      } finally {
        if (!controller.signal.aborted) {
          setVendorLoading(false);
        }
      }
    }

    loadVendors();

    return () => {
      controller.abort();
    };
  }, [selectedYear, selectedItems]);

  // Remove selected vendors that are no longer valid for the chosen items.
  useEffect(() => {
    if (vendorLoading) return;

    const availableVendors = new Set(
      vendorOptions.map((option) => option.value)
    );

    const validSelectedVendors = selectedVendors.filter((vendor) =>
      availableVendors.has(vendor)
    );

    if (validSelectedVendors.length !== selectedVendors.length) {
      handleVendorChange(validSelectedVendors);
    }
  }, [
    vendorOptions,
    vendorLoading,
    selectedVendors,
    handleVendorChange,
  ]);

  const displayedVendorOptions =
    vendorLoading && vendorOptions.length === 0
      ? selectedItems.length === 0
        ? initialVendorOptions
        : []
      : vendorOptions;

  return (
    <Card
      className="
        mb-8
        rounded-2xl
        border-0
        bg-gradient-to-r
        from-[#1D63B3]
        via-[#1D63B3]
        to-[#0F5BAA]
        p-5
        shadow-sm
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-5
          lg:grid-cols-[120px_280px_280px_270px_210px]
          lg:justify-between
        "
      >
        {/* YEAR */}
        <div>
          <label className="mb-3 block text-base font-semibold text-white">
            Year
          </label>

          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger
              className="
                h-[60px] rounded-xl border-0 bg-white
                text-base font-medium text-slate-800 shadow-sm
                focus:ring-2 focus:ring-white/40
              "
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* MONTH */}
        <div>
          <label className="mb-3 block text-base font-semibold text-white">
            Month
          </label>

          <MultiSelect
            className="
              w-full border-0 bg-white text-base
              font-medium text-slate-800 shadow-sm
              focus:ring-2 focus:ring-white/40
            "
            placeholder="All Months"
            searchPlaceholder="Search month..."
            emptyMessage="No month found."
            options={monthOptions}
            value={selectedMonths}
            onApply={handleMonthChange}
          />
        </div>

        {/* VENDOR */}
        <div>
          <label className="mb-3 block text-base font-semibold text-white">
            Vendor
          </label>

          <MultiSelect
            className="
              w-full border-0 bg-white text-base
              font-medium text-slate-800 shadow-sm
              focus:ring-2 focus:ring-white/40
            "
            placeholder={
              vendorLoading
                ? "Loading vendors..."
                : "All Vendors"
            }
            searchPlaceholder="Search vendor..."
            emptyMessage="No vendor found for selected item."
            options={displayedVendorOptions}
            value={selectedVendors}
            onApply={handleVendorChange}
          />
        </div>

        {/* ITEM */}
        <div>
          <label className="mb-3 block text-base font-semibold text-white">
            Item
          </label>

          <MultiSelect
            className="
              w-full border-0 bg-white text-base
              font-medium text-slate-800 shadow-sm
              focus:ring-2 focus:ring-white/40
            "
            placeholder={
              itemLoading ? "Loading items..." : "All Items"
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

        {/* RESET */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="
              h-11 w-full rounded-xl border-0 bg-white
              text-base font-medium text-slate-800 shadow-sm
              hover:bg-slate-50 hover:text-slate-900
            "
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset Filter
          </Button>
        </div>
      </div>
    </Card>
  );
}
