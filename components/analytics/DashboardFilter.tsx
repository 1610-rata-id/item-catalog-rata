"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDashboardFilter } from "@/hooks/use-dashboard-filter";
import { VendorList } from "@/types/vendor-list";
import SearchableSelect from "@/components/ui/searchable-select";
import MultiSelect from "@/components/ui/multi-select";

interface DashboardFilterProps {
  vendors: VendorList[];
}

export default function DashboardFilter({
  vendors,
}: DashboardFilterProps) {
  const {
  selectedYear,
  selectedMonths,
  selectedVendor,

  searchValue,
  setSearchValue,

  handleYearChange,
  handleMonthChange,
  handleVendorChange,
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
    <Card className="mb-8 rounded-2xl border-0 bg-white p-6 shadow-sm dark:bg-neutral-900">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_220px_320px_400px_170px]">

  {/* YEAR */}
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
        <SelectItem value="2026">2026</SelectItem>
        <SelectItem value="2025">2025</SelectItem>
        <SelectItem value="2024">2024</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* MONTH */}

<div>

  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
    Month
  </label>

  <MultiSelect
  className="w-full"
  placeholder="All Months"
  options={monthOptions}
  value={selectedMonths}
  onApply={handleMonthChange}
/>

</div>

  {/* VENDOR */}
<div>
  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
    Vendor
  </label>

  <SearchableSelect
    className="w-full"
    value={selectedVendor}
    onChange={handleVendorChange}
    placeholder="All Vendors"
    searchPlaceholder="Search vendor..."
    emptyMessage="Vendor not found."
    options={[
      {
        value: "all",
        label: "All Vendors",
      },
      ...vendors.map((vendor) => ({
        value: vendor.vendor_name,
        label: vendor.vendor_name,
      })),
    ]}
  />
</div>

  {/* SEARCH */}
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
      Item Name
    </label>

    <div className="relative">
      <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="h-11 rounded-xl pl-10"
        placeholder="Search item..."
      />
    </div>
  </div>

  {/* RESET */}
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