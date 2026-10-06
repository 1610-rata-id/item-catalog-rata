"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Filter,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EvaluationFiltersProps {
  vendors: string[];
  periods: string[];
  selectedVendors: string[];
  selectedPeriod: string;
  search: string;
  onVendorsChange: (vendors: string[]) => void;
  onPeriodChange: (period: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export default function EvaluationFilters({
  vendors,
  periods,
  selectedVendors,
  selectedPeriod,
  search,
  onVendorsChange,
  onPeriodChange,
  onSearchChange,
  onReset,
}: EvaluationFiltersProps) {
  const [vendorOpen, setVendorOpen] = useState(false);

  const vendorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        vendorRef.current &&
        !vendorRef.current.contains(event.target as Node)
      ) {
        setVendorOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  function toggleVendor(vendor: string) {
    if (selectedVendors.includes(vendor)) {
      onVendorsChange(
        selectedVendors.filter(
          (item) => item !== vendor
        )
      );
    } else {
      onVendorsChange([
        ...selectedVendors,
        vendor,
      ]);
    }
  }

  const vendorLabel =
    selectedVendors.length === 0
      ? "All Vendors"
      : selectedVendors.length === 1
        ? selectedVendors[0]
        : `${selectedVendors.length} Vendors`;

  return (
    <section className="rounded-2xl border-0 bg-[#1D63B3] p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.7fr_1.5fr_auto] xl:items-end">

        {/* VENDOR */}

        <div
          ref={vendorRef}
          className="relative"
        >
          <label className="mb-2 block text-xs font-medium text-white">
            Vendor
          </label>

          <button
            type="button"
            onClick={() =>
              setVendorOpen(!vendorOpen)
            }
            className="flex h-11 w-full items-center justify-between rounded-xl border border-white/20 bg-white px-3 text-sm text-slate-700 transition hover:border-white/40"
          >
            <span className="flex min-w-0 items-center gap-2 truncate">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Filter className="h-4 w-4" />
              </span>

              <span className="truncate">
                {vendorLabel}
              </span>
            </span>

            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </button>

          {vendorOpen && (
            <div className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

              <button
                type="button"
                onClick={() =>
                  onVendorsChange([])
                }
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                <span>All Vendors</span>

                {selectedVendors.length === 0 && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>

              {vendors.map((vendor) => {
                const selected =
                  selectedVendors.includes(
                    vendor
                  );

                return (
                  <button
                    type="button"
                    key={vendor}
                    onClick={() =>
                      toggleVendor(vendor)
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    <span className="truncate">
                      {vendor}
                    </span>

                    {selected && (
                      <Check className="h-4 w-4 shrink-0 text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* PERIOD */}

        <div>
          <label className="mb-2 block text-xs font-medium text-white">
            Period
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />

            <select
              value={selectedPeriod}
              onChange={(event) =>
                onPeriodChange(
                  event.target.value
                )
              }
              className="h-11 w-full appearance-none rounded-xl border border-white/20 bg-white pl-10 pr-8 text-sm text-slate-700 outline-none transition focus:border-white/40"
            >
              <option value="">
                All Periods
              </option>

              {periods.map((period) => (
                <option
                  key={period}
                  value={period}
                >
                  {period}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* SEARCH */}

        <div>
          <label className="mb-2 block text-xs font-medium text-white">
            Search
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
              placeholder="Search vendor name or keyword..."
              className="h-11 w-full rounded-xl border border-white/20 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-white/40"
            />
          </div>
        </div>


        {/* RESET */}

<button
  type="button"
  onClick={onReset}
  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
>
  <X className="h-4 w-4" />
  Reset Filter
</button>
      </div>
    </section>
  );
}