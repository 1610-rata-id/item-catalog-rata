"use client";

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

export default function ItemAbcFilter() {
  const {
    selectedYear,
    selectedMonths,
    handleYearChange,
    handleMonthChange,
    handleReset,
  } = useDashboardFilter();

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

  return (
    <Card
      className="
        mb-8
        rounded-2xl
        border-0
        bg-[#1D63B3]
        p-6
        shadow-sm
      "
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_320px_170px]">
        {/* YEAR */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Year
          </label>

          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger
              className="
                h-11
                rounded-xl
                border-white/20
                bg-white
                text-slate-900
                shadow-sm
                focus:ring-2
                focus:ring-white/40
              "
            >
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

        {/* MONTH */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Month
          </label>

          <MultiSelect
            className="
              w-full
              rounded-xl
              border-white/20
              bg-white
              text-slate-900
              shadow-sm
            "
            placeholder="All Months"
            searchPlaceholder="Search month..."
            emptyMessage="No month found."
            options={monthOptions}
            value={selectedMonths}
            onApply={handleMonthChange}
          />
        </div>

        {/* RESET */}
<div className="flex items-end">
  <Button
    variant="outline"
    onClick={handleReset}
    className="
      h-11
      w-full
      rounded-xl
      border-white/30
      bg-white
      text-slate-900
      shadow-sm
      transition-all
      duration-200
      hover:bg-slate-50
      hover:text-slate-900
    "
  >
    <RotateCcw className="mr-2 h-4 w-4" />
    Reset Filter
  </Button>
</div>
      </div>
    </Card>
  );
}